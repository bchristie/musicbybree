"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminArtistFilters } from "@/hooks/useAdminArtistFilters";
import { SearchBar } from "./SearchBar";
import { FilterAccordion } from "./FilterAccordion";
import { ArtistListDesktop, type ArtistWithSongCount } from "./ArtistListDesktop";
import { ArtistListMobile } from "./ArtistListMobile";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminArtistListProps {
  initialArtists: ArtistWithSongCount[];
}

export function AdminArtistList({ initialArtists }: AdminArtistListProps) {
  const { filters, updateFilters, clearFilters, isPending } = useAdminArtistFilters();
  const [artists, setArtists] = useState<ArtistWithSongCount[]>(initialArtists);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique genres and eras for filter dropdowns
  const { availableGenres, availableEras } = useMemo(() => {
    const genres = new Set<string>();
    const eras = new Set<string>();

    artists.forEach((artist) => {
      if (artist.genre) genres.add(artist.genre);
      if (artist.era) eras.add(artist.era);
    });

    return {
      availableGenres: Array.from(genres).sort(),
      availableEras: Array.from(eras).sort(),
    };
  }, [artists]);

  // Filter and sort artists
  const filteredArtists = useMemo(() => {
    let result = [...artists];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((artist) =>
        artist.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      result = result.filter((artist) => artist.genre === filters.genre);
    }

    // Apply era filter
    if (filters.era) {
      result = result.filter((artist) => artist.era === filters.era);
    }

    // Apply has songs filter
    if (filters.hasSongs === "yes") {
      result = result.filter((artist) => (artist._count?.songs ?? 0) > 0);
    } else if (filters.hasSongs === "no") {
      result = result.filter((artist) => (artist._count?.songs ?? 0) === 0);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "genre":
          comparison = (a.genre || "").localeCompare(b.genre || "");
          break;
        case "era":
          comparison = (a.era || "").localeCompare(b.era || "");
          break;
        case "songCount":
          comparison = (a._count?.songs ?? 0) - (b._count?.songs ?? 0);
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [artists, filters]);

  // Refresh data from API
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/artists");
      if (response.ok) {
        const data = await response.json();
        // Update state by ID to prevent full repaint
        setArtists(data.artists);
      }
    } catch (error) {
      console.error("Failed to refresh artists:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle sorting
  const handleSort = (sortBy: typeof filters.sortBy) => {
    if (filters.sortBy === sortBy) {
      // Toggle sort order
      updateFilters({
        sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      // New sort column, default to ascending
      updateFilters({ sortBy, sortOrder: "asc" });
    }
  };

  // Handle artist selection (placeholder)
  const handleSelect = (artistId: string) => {
    console.log("Artist selected:", artistId);
    // TODO: Navigate to artist detail page or open modal
  };

  return (
    <div className="space-y-4">
      {/* Header with search and refresh */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar
            value={filters.search}
            onChange={(value) => updateFilters({ search: value }, true)}
            isPending={isPending}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filters */}
      <FilterAccordion
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        availableGenres={availableGenres}
        availableEras={availableEras}
      />

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          Showing {filteredArtists.length} of {artists.length} artist
          {artists.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <ArtistListDesktop
          artists={filteredArtists}
          filters={filters}
          onSort={handleSort}
          onSelect={handleSelect}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <ArtistListMobile
          artists={filteredArtists}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
