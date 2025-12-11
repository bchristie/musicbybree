"use client";

import { ArtistForm } from "./ArtistForm";
import { ArtistSongList } from "./ArtistSongList";
import type { ArtistDetailData, ArtistSong } from "./types";

export type { ArtistDetailData, ArtistFormData, ArtistSong } from "./types";

interface AdminArtistDetailProps {
  artist?: ArtistDetailData;
  songs?: ArtistSong[];
}

export function AdminArtistDetail({ artist, songs = [] }: AdminArtistDetailProps) {
  return (
    <div className="space-y-6">
      <ArtistForm artist={artist} />
      {artist && <ArtistSongList songs={songs} artistName={artist.name} artistId={artist.id} />}
    </div>
  );
}
