"use client";

import { Music2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyLyricsStateProps {
  onFetchLyrics: () => void;
  onAddManually: () => void;
  isFetching: boolean;
}

export function EmptyLyricsState({ onFetchLyrics, onAddManually, isFetching }: EmptyLyricsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
      <Music2 className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
        No lyrics available
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
        Fetch lyrics automatically or add them manually to display during performances
      </p>
      <div className="flex gap-3">
        <Button onClick={onFetchLyrics} disabled={isFetching}>
          {isFetching ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Fetching...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Fetch Lyrics
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onAddManually} disabled={isFetching}>
          Add Manually
        </Button>
      </div>
    </div>
  );
}
