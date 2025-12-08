"use client";

import Link from "next/link";
import type { SongWithRelations } from "./types";
import { useRepertoireFilters } from "@/hooks/useRepertoireFilters";
import { Music } from "lucide-react";

interface SongCardProps {
  song: SongWithRelations;
}

export function SongCard({ song }: SongCardProps) {
  const { toggleTag, filters } = useRepertoireFilters();

  // Determine visible tags (first 2-3 or all if tag is in active filters)
  const visibleTags = song.tags.filter((st) => filters.tags.includes(st.tag.id));
  const remainingTags = song.tags.filter((st) => !filters.tags.includes(st.tag.id));
  const tagsToShow = [...visibleTags, ...remainingTags.slice(0, Math.max(0, 3 - visibleTags.length))];
  const hiddenCount = song.tags.length - tagsToShow.length;

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Key and Tempo badges in top right corner */}
      <div className="absolute top-3 right-3 flex gap-1">
        {song.originalKey && (
          <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
            {song.originalKey}
          </span>
        )}
        {song.tempo && (
          <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded flex items-center gap-0.5">
            <Music className="w-3 h-3" />
            {song.tempo}
          </span>
        )}
      </div>

      {/* Song Title - clickable to detail page */}
      <Link href={`/songs/${song.id}`} className="block">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1 pr-20 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          {song.title}
        </h3>
      </Link>

      {/* Artist Name */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        {song.artist.name}
      </p>

      {/* Tags */}
      {song.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagsToShow.map((st) => {
            const isActive = filters.tags.includes(st.tag.id);
            return (
              <button
                key={st.tag.id}
                onClick={() => toggleTag(st.tag.id)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                style={
                  st.tag.color && !isActive
                    ? {
                        backgroundColor: `${st.tag.color}20`,
                        color: st.tag.color,
                      }
                    : undefined
                }
              >
                {st.tag.name}
              </button>
            );
          })}
          {hiddenCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 rounded">
              +{hiddenCount} more
            </span>
          )}
        </div>
      )}

      {/* Duration and Notes (optional, can show on hover or always) */}
      {song.duration && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
        </p>
      )}
    </div>
  );
}
