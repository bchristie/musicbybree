/**
 * Types for AdminArtistList component and provider
 */

export type ArtistWithSongCount = {
  id: string;
  name: string;
  genre: string | null;
  era: string | null;
  description: string | null;
  _count: { songs: number };
};

export type ArtistFilters = {
  search: string;
  genre: string;
  era: string;
  hasSongs: string; // "all", "yes", "no"
  sortBy: "name" | "genre" | "era" | "songCount";
  sortOrder: "asc" | "desc";
};

export interface ArtistListContextValue {
  // Data
  artists: ArtistWithSongCount[];
  filteredArtists: ArtistWithSongCount[];
  
  // Filters
  filters: ArtistFilters;
  setSearch: (value: string) => void;
  setGenre: (value: string) => void;
  setEra: (value: string) => void;
  setHasSongs: (value: string) => void;
  setSortBy: (sortBy: ArtistFilters["sortBy"]) => void;
  setSortOrder: (sortOrder: ArtistFilters["sortOrder"]) => void;
  clearFilters: () => void;
  
  // State
  isPending: boolean;
}
