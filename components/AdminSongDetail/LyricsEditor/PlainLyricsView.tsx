"use client";

import { Textarea } from "@/components/ui/textarea";

interface PlainLyricsViewProps {
  lyrics: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PlainLyricsView({ lyrics, onChange, disabled }: PlainLyricsViewProps) {
  return (
    <Textarea
      value={lyrics}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Paste or type lyrics here..."
      rows={20}
      className="font-mono text-sm"
    />
  );
}
