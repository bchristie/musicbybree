"use client";

import { useMemo, useState } from "react";
import type { SongWithRelations, GroupedSongs } from "./types";
import { useRepertoireFilters } from "@/hooks/useRepertoireFilters";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { ArtistGroup } from "./ArtistGroup";
import { SongCard } from "./SongCard";

interface PublicSongListProps {
  songs: SongWithRelations[];
}

export function PublicSongList({ songs }: PublicSongListProps) {
  const { filters, activeFilterCount } = useRepertoireFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter songs based on active filters
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = song.title.toLowerCase().includes(searchLower);
        const matchesArtist = song.artist.name.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesArtist) return false;
      }

      // Tag filter (match ANY selected tag)
      if (filters.tags.length > 0) {
        const songTagIds = song.tags.map((t) => t.tag.id);
        const hasMatchingTag = filters.tags.some((tagId) => songTagIds.includes(tagId));
        if (!hasMatchingTag) return false;
      }

      // Key filter
      if (filters.keys.length > 0 && song.originalKey) {
        if (!filters.keys.includes(song.originalKey)) return false;
      }

      // Artist filter
      if (filters.artists.length > 0) {
        if (!filters.artists.includes(song.artistId)) return false;
      }

      // Status filter
      if (filters.statuses.length > 0) {
        const status = song.repertoireEntry?.status;
        if (!status || !filters.statuses.includes(status)) return false;
      }

      // Tempo filter
      if (song.tempo) {
        if (filters.tempoMin !== null && song.tempo < filters.tempoMin) return false;
        if (filters.tempoMax !== null && song.tempo > filters.tempoMax) return false;
      }

      return true;
    });
  }, [songs, filters]);

  // Group songs by artist or keep flat
  const groupedOrFlat = useMemo(() => {
    if (filters.sort === "artist") {
      // Group by artist
      const groups: GroupedSongs[] = [];
      const artistMap = new Map<string, SongWithRelations[]>();

      filteredSongs.forEach((song) => {
        if (!artistMap.has(song.artistId)) {
          artistMap.set(song.artistId, []);
        }
        artistMap.get(song.artistId)!.push(song);
      });

      artistMap.forEach((songs, artistId) => {
        groups.push({
          artist: songs[0].artist,
          songs: songs.sort((a, b) => a.title.localeCompare(b.title)),
        });
      });

      return groups.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
    } else {
      // Flat list sorted by song title
      return [...filteredSongs].sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [filteredSongs, filters.sort]);

  // Extract unique values for filters
  const uniqueKeys = useMemo(() => {
    const keys = new Set<string>();
    songs.forEach((song) => {
      if (song.originalKey) keys.add(song.originalKey);
    });
    return Array.from(keys).sort();
  }, [songs]);

  const uniqueArtists = useMemo(() => {
    const artistMap = new Map();
    songs.forEach((song) => {
      if (!artistMap.has(song.artistId)) {
        artistMap.set(song.artistId, song.artist);
      }
    });
    return Array.from(artistMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [songs]);

  const allTags = useMemo(() => {
    const tagMap = new Map();
    songs.forEach((song) => {
      song.tags.forEach((st) => {
        if (!tagMap.has(st.tag.id)) {
          tagMap.set(st.tag.id, st.tag);
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [songs]);

  // Group tags by category
  const tagsByCategory = useMemo(() => {
    const grouped = new Map<string, typeof allTags>();
    allTags.forEach((tag) => {
      const category = tag.category || "Other";
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(tag);
    });
    return grouped;
  }, [allTags]);

  return (
    <div className="min-h-screen">
      <SearchBar onFilterClick={() => setIsFilterOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile/Tablet: Filter button in SearchBar, Desktop: Sidebar */}
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar (lg+) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel
                tags={tagsByCategory}
                keys={uniqueKeys}
                artists={uniqueArtists}
                layout="sidebar"
              />
            </div>
          </aside>

          {/* Song List */}
          <main className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filteredSongs.length} of {songs.length} songs
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active)`}
            </div>

            {/* Empty state */}
            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  {songs.length === 0 ? "No songs available" : "No songs match your filters"}
                </p>
              </div>
            )}

            {/* Song display */}
            {filters.sort === "artist" ? (
              // Grouped by artist
              <div className="space-y-8">
                {(groupedOrFlat as GroupedSongs[]).map((group) => (
                  <ArtistGroup key={group.artist.id} artist={group.artist} songs={group.songs} />
                ))}
              </div>
            ) : (
              // Flat list
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(groupedOrFlat as SongWithRelations[]).map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile/Tablet Filter Panel (slide-up/slide-out) */}
      <FilterPanel
        tags={tagsByCategory}
        keys={uniqueKeys}
        artists={uniqueArtists}
        layout="mobile"
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
