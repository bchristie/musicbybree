/**
 * Types for AdminSongList component and provider
 */

import type { RepertoireStatus } from "@prisma/client";

export type SongWithRelations = {
  id: string;
  title: string;
  artistId: string;
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
  lyric: {
    id: string;
  } | null;
  repertoireEntry: {
    id: string;
    status: RepertoireStatus;
  } | null;
};

export type SongFilters = {
  search: string;
  artist: string;
  tags: string[]; // Tag IDs
  repertoireStatus: string; // "all", "none", "LEARNING", "READY", "FEATURED", "ARCHIVED"
  hasLyrics: string; // "all", "yes", "no"
  sortBy: "title" | "artist" | "status";
  sortOrder: "asc" | "desc";
  page: number;
  perPage: number;
};

export interface SongListContextValue {
  // Data
  songs: SongWithRelations[];
  filteredSongs: SongWithRelations[];
  paginatedSongs: SongWithRelations[];
  totalPages: number;
  
  // Filters
  filters: SongFilters;
  setSearch: (value: string) => void;
  setArtist: (value: string) => void;
  setTags: (value: string[]) => void;
  setRepertoireStatus: (value: string) => void;
  setHasLyrics: (value: string) => void;
  setSortBy: (sortBy: SongFilters["sortBy"]) => void;
  setSortOrder: (sortOrder: SongFilters["sortOrder"]) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  clearFilters: () => void;
  
  // Selection
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  toggleAll: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  isPageSelected: boolean;
  hasAnySelected: boolean;
  
  // State
  isPending: boolean;
}
