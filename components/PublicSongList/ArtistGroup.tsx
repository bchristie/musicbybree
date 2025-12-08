"use client";

import type { Artist } from "@prisma/client";
import type { SongWithRelations } from "./types";
import { SongCard } from "./SongCard";

interface ArtistGroupProps {
  artist: Artist;
  songs: SongWithRelations[];
}

export function ArtistGroup({ artist, songs }: ArtistGroupProps) {
  return (
    <div className="space-y-4">
      {/* Artist Header */}
      <div className="flex items-baseline gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {artist.name}
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-500">
          {songs.length} {songs.length === 1 ? "song" : "songs"}
        </span>
        {artist.genre && (
          <span className="text-sm text-zinc-400 dark:text-zinc-600">• {artist.genre}</span>
        )}
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
