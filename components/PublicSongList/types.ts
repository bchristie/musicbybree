import type { Song, Artist, Tag, RepertoireEntry } from "@prisma/client";

export type SongWithRelations = Song & {
  artist: Artist;
  repertoireEntry: Pick<RepertoireEntry, 'status' | 'performedKey' | 'performedTempo' | 'typicalDuration'> | null;
  tags: Array<{
    tag: Tag;
  }>;
};

export interface GroupedSongs {
  artist: Artist;
  songs: SongWithRelations[];
}
