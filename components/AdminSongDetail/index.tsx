"use client";

import { SongForm } from "./SongForm";
import type { SongDetailData, TagOption, ArtistOption } from "./types";

export type { SongDetailData, SongFormData, TagOption, ArtistOption } from "./types";

interface AdminSongDetailProps {
  song?: SongDetailData;
  artistId: string;
  artistName: string;
  tags: TagOption[];
  artists: ArtistOption[];
}

export function AdminSongDetail({ song, artistId, artistName, tags, artists }: AdminSongDetailProps) {
  return (
    <div className="space-y-6">
      <SongForm song={song} artistId={artistId} artistName={artistName} tags={tags} artists={artists} />
    </div>
  );
}
