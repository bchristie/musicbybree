import type { Song, Artist, Tag } from "@prisma/client";

export type SongWithRelations = Song & {
  artist: Artist;
  tags: Array<{
    tag: Tag;
  }>;
};

export interface GroupedSongs {
  artist: Artist;
  songs: SongWithRelations[];
}
