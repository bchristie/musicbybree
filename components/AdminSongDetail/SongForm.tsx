"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Save, ChevronDown, Trash2, Sparkles } from "lucide-react";
import { TagSelector } from "@/components/shared/TagSelector";
import type { SongDetailData, SongFormData, TagOption, ArtistOption } from "./types";

interface SongFormProps {
  song?: SongDetailData;
  artistId: string;
  artistName: string;
  tags: TagOption[];
  artists: ArtistOption[];
}

export function SongForm({ song, artistId, artistName, tags, artists }: SongFormProps) {
  const router = useRouter();
  const isNew = !song;

  const [formData, setFormData] = useState<SongFormData>({
    title: song?.title ?? "",
    artistId: song?.artistId ?? artistId,
    originalKey: song?.originalKey ?? "",
    tempo: song?.tempo?.toString() ?? "",
    duration: song?.duration?.toString() ?? "",
    notes: song?.notes ?? "",
    tags: song?.tags.map((t) => t.tag.id) ?? [],
    genre: undefined,
    mood: undefined,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SongFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Song title is required";
    }

    if (!formData.artistId) {
      newErrors.artistId = "Artist is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: "Enter a song title to auto-fill" });
      return;
    }

    setIsAutoFilling(true);
    try {
      // Get artist name for hint
      const artist = artists.find(a => a.id === formData.artistId);
      
      const response = await fetch("/api/admin/songs/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: formData.title,
          artistHint: artist?.name 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const songInfo = data.song;
        
        setFormData((prev) => ({
          ...prev,
          title: songInfo.title || prev.title,
          originalKey: songInfo.originalKey || prev.originalKey,
          tempo: songInfo.tempo?.toString() || prev.tempo,
          duration: songInfo.durationSeconds?.toString() || prev.duration,
          notes: songInfo.mood ? `${songInfo.mood}${prev.notes ? '\n\n' + prev.notes : ''}` : prev.notes,
          genre: songInfo.genre,
          mood: songInfo.mood,
        }));
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to auto-fill song information" });
      }
    } catch (error) {
      console.error("Auto-fill failed:", error);
      setErrors({ submit: "Failed to auto-fill song information" });
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, andContinue = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const url = song ? `/api/songs/${song.id}` : "/api/songs";
      const method = song ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tempo: formData.tempo ? parseInt(formData.tempo) : null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          genre: formData.genre,
          mood: formData.mood,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save song");
      }

      const savedSong = await response.json();

      if (andContinue) {
        toast.success("Song saved successfully");
        // Reset form for new entry
        setFormData({
          title: "",
          artistId: formData.artistId,
          originalKey: "",
          tempo: "",
          duration: "",
          notes: "",
          tags: [],
          genre: undefined,
          mood: undefined,
        });
      } else if (!song) {
        toast.success("Song created successfully");
        // New song - navigate to song detail page
        router.push(`/admin/artists/${formData.artistId}/songs/${savedSong.id}`);
      } else {
        toast.success("Song updated successfully");
      }
      // For existing song edits, no action needed - state is already updated
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!song) return;
    if (!confirm(`Are you sure you want to delete "${song.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setErrors({});

    try {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete song");
      }

      router.push(`/admin/artists/${artistId}`);
      router.refresh();
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "An error occurred",
      });
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/artists/${formData.artistId}`);
  };

  const toggleTag = (tagId: string) => {
    handleChange(
      "tags",
      formData.tags.includes(tagId)
        ? formData.tags.filter((t) => t !== tagId)
        : [...formData.tags, tagId]
    );
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{isNew ? "New Song" : "Edit Song"}</CardTitle>
              <CardDescription>
                {isNew ? `Add a new song for ${artistName}` : `Editing "${song.title}"`}
              </CardDescription>
            </div>
            {!isNew && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Song Title <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter song title"
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutoFill}
                  disabled={isAutoFilling || isSaving || !formData.title.trim()}
                >
                  {isAutoFilling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Auto-fill</span>
                </Button>
              </div>
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artistId">
                Artist <span className="text-red-500">*</span>
              </Label>
              <select
                id="artistId"
                value={formData.artistId}
                onChange={(e) => handleChange("artistId", e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              >
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
              {errors.artistId && (
                <p className="text-sm text-red-500">{errors.artistId}</p>
              )}
            </div>
          </div>

          {/* Musical Details */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="originalKey">Original Key</Label>
              <Input
                id="originalKey"
                value={formData.originalKey}
                onChange={(e) => handleChange("originalKey", e.target.value)}
                placeholder="e.g., C, Am, F#"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempo">Tempo (BPM)</Label>
              <Input
                id="tempo"
                type="number"
                value={formData.tempo}
                onChange={(e) => handleChange("tempo", e.target.value)}
                placeholder="e.g., 120"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g., 180"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Performance notes, arrangement details, etc."
              rows={4}
              disabled={isSaving}
            />
          </div>

          {/* Tags */}
          <TagSelector
            tags={tags}
            selectedTags={formData.tags}
            onToggle={toggleTag}
            label="Tags"
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving || isDeleting}
            >
              Cancel
            </Button>

            {isNew ? (
              <div className="flex">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-r-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Song
                    </>
                  )}
                </Button>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      disabled={isSaving}
                      className="rounded-l-none border-l-0 px-2"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as any;
                        formEvent.preventDefault = () => {};
                        handleSubmit(formEvent, true);
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Create & Continue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button type="submit" disabled={isSaving || isDeleting}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
