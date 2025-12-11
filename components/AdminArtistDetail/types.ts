/**
 * Types for AdminArtistDetail component
 */

export type ArtistDetailData = {
  id: string;
  name: string;
  genre: string | null;
  era: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    songs: number;
  };
};

export type ArtistFormData = {
  name: string;
  genre: string;
  era: string;
  description: string;
};

export type ArtistSong = {
  id: string;
  title: string;
  originalKey: string | null;
  tempo: number | null;
  duration: number | null;
  repertoireEntry: {
    status: string;
  } | null;
};
