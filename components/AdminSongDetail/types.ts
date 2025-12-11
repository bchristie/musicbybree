/**
 * Types for AdminSongDetail component
 */

export type SongDetailData = {
  id: string;
  title: string;
  artistId: string;
  originalKey: string | null;
  tempo: number | null;
  duration: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  artist: {
    id: string;
    name: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      category: string;
      color: string | null;
    };
  }>;
  repertoireEntry?: {
    status: string;
    performedKey: string | null;
    performedTempo: number | null;
    typicalDuration: number | null;
    notes: string | null;
    arrangement: string | null;
    difficulty: number | null;
    vocallyDemanding: boolean | null;
    energyLevel: number | null;
    worksWellFor: string | null;
    avoidAfter: string | null;
    lastPracticed: Date | null;
    practiceCount: number | null;
    performanceCount: number | null;
  } | null;
};

export type SongFormData = {
  title: string;
  artistId: string;
  originalKey: string;
  tempo: string;
  duration: string;
  notes: string;
  tags: string[];
  genre?: string;
  mood?: string;
};

export type TagOption = {
  id: string;
  name: string;
  category: string;
  color: string | null;
};

export type ArtistOption = {
  id: string;
  name: string;
};
