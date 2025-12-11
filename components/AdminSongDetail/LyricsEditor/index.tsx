"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EmptyLyricsState } from "./EmptyLyricsState";
import { PlainLyricsView } from "./PlainLyricsView";
import { TimedLyricsView } from "./TimedLyricsView";
import type { LyricsData, LyricLineData } from "./types";

interface LyricsEditorProps {
  songId: string;
  initialLyrics?: LyricsData | null;
  songTitle: string;
  artistName: string;
}

export function LyricsEditor({ songId, initialLyrics, songTitle, artistName }: LyricsEditorProps) {
  const [lyrics, setLyrics] = useState<LyricsData | null>(initialLyrics || null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFetchLyrics = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/songs/${songId}/lyrics/fetch`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch lyrics");
      }

      const data = await response.json();
      setLyrics(data);
      toast.success(`Successfully retrieved lyrics from ${data.source}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch lyrics");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddManually = () => {
    setLyrics({
      hasTiming: false,
      lines: [{ text: "", order: 1, breakAfter: false }],
    });
  };

  const handleTimingToggle = (checked: boolean) => {
    if (!lyrics) return;

    if (checked) {
      // Converting to timed: parse timestamps from text if present
      const updatedLines = lyrics.lines.map((line) => {
        const match = line.text.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
        if (match) {
          const mins = parseInt(match[1]);
          const secs = parseFloat(match[2]);
          const text = match[3];
          return { ...line, time: mins * 60 + secs, text };
        }
        return { ...line, time: 0 };
      });
      setLyrics({ ...lyrics, hasTiming: true, lines: updatedLines });
    } else {
      // Converting to plain: remove timing
      const updatedLines = lyrics.lines.map((line) => {
        const { time, ...rest } = line;
        return rest;
      });
      setLyrics({ ...lyrics, hasTiming: false, lines: updatedLines });
    }
  };

  const handlePlainTextChange = (text: string) => {
    if (!lyrics) return;
    
    // Split by lines and detect paragraph breaks (double newlines)
    const textLines = text.split('\n');
    const lines = [];
    let order = 1;
    
    for (let i = 0; i < textLines.length; i++) {
      const lineText = textLines[i];
      
      // Check if next line is empty (paragraph break)
      const nextLineEmpty = i + 1 < textLines.length && textLines[i + 1] === '';
      const hasMoreContent = textLines.slice(i + 2).some(line => line !== '');
      
      lines.push({
        text: lineText,
        order: order++,
        breakAfter: nextLineEmpty && hasMoreContent,
      });
      
      // Skip the blank line we just detected
      if (nextLineEmpty) {
        i++;
      }
    }
    
    setLyrics({ ...lyrics, lines });
  };

  const handleTimedLinesChange = (lines: LyricLineData[]) => {
    if (!lyrics) return;
    setLyrics({ ...lyrics, lines });
  };

  const handleSave = async () => {
    if (!lyrics) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/songs/${songId}/lyrics`, {
        method: lyrics.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lyrics),
      });

      if (!response.ok) {
        throw new Error("Failed to save lyrics");
      }

      const data = await response.json();
      setLyrics(data);
      toast.success("Lyrics have been successfully saved");
    } catch (error) {
      toast.error("Failed to save lyrics");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lyrics?.id) return;

    if (!confirm("Are you sure you want to delete these lyrics?")) return;

    try {
      const response = await fetch(`/api/songs/${songId}/lyrics`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lyrics");
      }

      setLyrics(null);
      toast.success("Lyrics have been removed");
    } catch (error) {
      toast.error("Failed to delete lyrics");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lyrics</CardTitle>
          {lyrics && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="timing-mode"
                  checked={lyrics.hasTiming}
                  onCheckedChange={handleTimingToggle}
                  disabled={isSaving}
                />
                <Label htmlFor="timing-mode" className="text-sm font-normal cursor-pointer">
                  Timed lyrics
                </Label>
              </div>
              <div className="flex gap-2">
                {lyrics.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!lyrics ? (
          <EmptyLyricsState
            onFetchLyrics={handleFetchLyrics}
            onAddManually={handleAddManually}
            isFetching={isFetching}
          />
        ) : lyrics.hasTiming ? (
          <TimedLyricsView
            lines={lyrics.lines}
            hasTiming={lyrics.hasTiming}
            onChange={handleTimedLinesChange}
            disabled={isSaving}
          />
        ) : (
          <PlainLyricsView
            lyrics={lyrics.lines.map((line, i) => 
              line.text + (line.breakAfter ? '\n' : '')
            ).join('\n')}
            onChange={handlePlainTextChange}
            disabled={isSaving}
          />
        )}
      </CardContent>
    </Card>
  );
}
