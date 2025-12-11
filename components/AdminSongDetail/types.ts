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
  lyric?: {
    id: string;
    hasTiming: boolean;
    source: string | null;
    lines: Array<{
      id: string;
      text: string;
      time: number | null;
      order: number;
      breakAfter: boolean;
    }>;
  } | null;
  repertoireEntry?: {
    id: string;
    songId: string;
    status: string;
    performedKey: string | null;
    performedTempo: number | null;
    capoPosition: number | null;
    typicalDuration: number | null;
    difficulty: number | null;
    vocallyDemanding: boolean;
    energyLevel: number | null;
    worksWellFor: string | null;
    avoidAfter: string | null;
    notes: string | null;
    arrangement: string | null;
    addedAt: Date;
    lastPracticed: Date | null;
    lastPerformed: Date | null;
    practiceCount: number;
    performanceCount: number;
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
