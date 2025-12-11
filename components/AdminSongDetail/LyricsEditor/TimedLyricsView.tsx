"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LyricLine } from "./LyricLine";
import type { LyricLineData } from "./types";

interface TimedLyricsViewProps {
  lines: LyricLineData[];
  hasTiming: boolean;
  onChange: (lines: LyricLineData[]) => void;
  disabled?: boolean;
}

export function TimedLyricsView({ lines, hasTiming, onChange, disabled }: TimedLyricsViewProps) {
  const handleLineChange = (index: number, updatedLine: LyricLineData) => {
    const newLines = [...lines];
    newLines[index] = updatedLine;
    onChange(newLines);
  };

  const handleDeleteLine = (index: number) => {
    const newLines = lines.filter((_, i) => i !== index);
    // Re-order remaining lines
    const reorderedLines = newLines.map((line, i) => ({ ...line, order: i + 1 }));
    onChange(reorderedLines);
  };

  const handleAddLine = () => {
    const newLine: LyricLineData = {
      text: "",
      time: hasTiming ? 0 : undefined,
      order: lines.length + 1,
      breakAfter: false,
    };
    onChange([...lines, newLine]);
  };

  return (
    <div className="space-y-2">
      {lines.map((line, index) => (
        <LyricLine
          key={index}
          line={line}
          hasTiming={hasTiming}
          onChange={(updated) => handleLineChange(index, updated)}
          onDelete={() => handleDeleteLine(index)}
          disabled={disabled}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddLine}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Line
      </Button>
    </div>
  );
}
