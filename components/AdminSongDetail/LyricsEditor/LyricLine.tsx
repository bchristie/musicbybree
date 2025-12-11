"use client";

import { GripVertical, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LyricLineData } from "./types";

interface LyricLineProps {
  line: LyricLineData;
  hasTiming: boolean;
  onChange: (line: LyricLineData) => void;
  onDelete: () => void;
  disabled?: boolean;
}

// Convert seconds to MM:SS.s format
function formatTime(seconds: number | null | undefined): string {
  if (seconds === undefined || seconds === null) return "";
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}:${secs.padStart(4, '0')}`;
}

// Convert MM:SS.s to seconds
function parseTime(timeStr: string): number | null | undefined {
  if (!timeStr.trim()) return undefined;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return undefined;
  const mins = parseInt(parts[0]);
  const secs = parseFloat(parts[1]);
  if (isNaN(mins) || isNaN(secs)) return undefined;
  return mins * 60 + secs;
}

export function LyricLine({ line, hasTiming, onChange, onDelete, disabled }: LyricLineProps) {
  return (
    <div className="flex items-center gap-2 group">
      {hasTiming && (
        <>
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-zinc-400" />
          </div>
          <Input
            type="text"
            value={formatTime(line.time)}
            onChange={(e) => onChange({ ...line, time: parseTime(e.target.value) })}
            disabled={disabled}
            placeholder="0:00.0"
            className="w-20 text-center font-mono text-sm"
          />
        </>
      )}
      <Input
        type="text"
        value={line.text}
        onChange={(e) => onChange({ ...line, text: e.target.value })}
        disabled={disabled}
        placeholder="Lyric line..."
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={disabled}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
