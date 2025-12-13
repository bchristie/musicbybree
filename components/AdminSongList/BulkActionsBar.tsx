"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSongList } from "./SongListProvider";

export function BulkActionsBar() {
  const { selectedIds, clearSelection } = useSongList();

  if (selectedIds.size === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2">
      <div className="bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg shadow-lg border border-zinc-700 px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedIds.size} {selectedIds.size === 1 ? 'song' : 'songs'} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="h-6 w-6 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-zinc-700" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement add to performance
              console.log('Add to performance:', Array.from(selectedIds));
            }}
            className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
          >
            Add to Performance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement change status
              console.log('Change status:', Array.from(selectedIds));
            }}
            className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
          >
            Change Status
          </Button>
        </div>
      </div>
    </div>
  );
}
