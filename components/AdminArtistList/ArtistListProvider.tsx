"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ArtistWithSongCount, ArtistFilters, ArtistListContextValue } from "./types";

const ArtistListContext = createContext<ArtistListContextValue | null>(null);

export function useArtistList() {
  const context = useContext(ArtistListContext);
  if (!context) {
    throw new Error("useArtistList must be used within ArtistListProvider");
  }
  return context;
}

interface ArtistListProviderProps {
  initialArtists: ArtistWithSongCount[];
  children: React.ReactNode;
}

export function ArtistListProvider({ initialArtists, children }: ArtistListProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Local state for immediate UI updates (no blur/flicker)
  const [localFilters, setLocalFilters] = useState<ArtistFilters>(() => ({
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    era: searchParams.get("era") || "",
    hasSongs: searchParams.get("hasSongs") || "all",
    sortBy: (searchParams.get("sortBy") as ArtistFilters["sortBy"]) || "name",
    sortOrder: (searchParams.get("sortOrder") as ArtistFilters["sortOrder"]) || "asc",
  }));

  // Timer for batched URL updates
  const urlUpdateTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync URL to local state when user navigates (back/forward)
  useEffect(() => {
    setLocalFilters({
      search: searchParams.get("search") || "",
      genre: searchParams.get("genre") || "",
      era: searchParams.get("era") || "",
      hasSongs: searchParams.get("hasSongs") || "all",
      sortBy: (searchParams.get("sortBy") as ArtistFilters["sortBy"]) || "name",
      sortOrder: (searchParams.get("sortOrder") as ArtistFilters["sortOrder"]) || "asc",
    });
  }, [searchParams]);

  // Update URL (batched and debounced)
  const updateURL = useCallback((filters: ArtistFilters, immediate = false) => {
    const doUpdate = () => {
      const params = new URLSearchParams();
      
      if (filters.search) params.set("search", filters.search);
      if (filters.genre) params.set("genre", filters.genre);
      if (filters.era) params.set("era", filters.era);
      if (filters.hasSongs !== "all") params.set("hasSongs", filters.hasSongs);
      if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
      if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder);

      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    };

    if (immediate) {
      // Clear any pending updates
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
      doUpdate();
    } else {
      // Batch URL updates to avoid rapid navigation
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
      urlUpdateTimerRef.current = setTimeout(doUpdate, 100);
    }
  }, [router]);

  // Filter update handlers
  const setSearch = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, search: value };
      updateURL(next, false);
      return next;
    });
  }, [updateURL]);

  const setGenre = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, genre: value };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setEra = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, era: value };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setHasSongs = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, hasSongs: value };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setSortBy = useCallback((sortBy: ArtistFilters["sortBy"]) => {
    setLocalFilters(prev => {
      const next = { ...prev, sortBy };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setSortOrder = useCallback((sortOrder: ArtistFilters["sortOrder"]) => {
    setLocalFilters(prev => {
      const next = { ...prev, sortOrder };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const clearFilters = useCallback(() => {
    const defaultFilters: ArtistFilters = {
      search: "",
      genre: "",
      era: "",
      hasSongs: "all",
      sortBy: "name",
      sortOrder: "asc",
    };
    setLocalFilters(defaultFilters);
    startTransition(() => {
      router.replace(window.location.pathname, { scroll: false });
    });
  }, [router]);

  // Apply filters and sorting to artists
  const filteredArtists = React.useMemo(() => {
    let filtered = [...initialArtists];

    // Apply search filter
    if (localFilters.search) {
      const searchLower = localFilters.search.toLowerCase();
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchLower) ||
        artist.genre?.toLowerCase().includes(searchLower) ||
        artist.era?.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter (handles comma-separated genres)
    if (localFilters.genre) {
      filtered = filtered.filter(artist => {
        if (!artist.genre) return false;
        const artistGenres = artist.genre.split(',').map(g => g.trim());
        return artistGenres.includes(localFilters.genre);
      });
    }

    // Apply era filter
    if (localFilters.era) {
      filtered = filtered.filter(artist => artist.era === localFilters.era);
    }

    // Apply hasSongs filter
    if (localFilters.hasSongs === "yes") {
      filtered = filtered.filter(artist => artist._count.songs > 0);
    } else if (localFilters.hasSongs === "no") {
      filtered = filtered.filter(artist => artist._count.songs === 0);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (localFilters.sortBy) {
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
          comparison = a._count.songs - b._count.songs;
          break;
      }

      return localFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [initialArtists, localFilters]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
    };
  }, []);

  const value: ArtistListContextValue = {
    artists: initialArtists,
    filteredArtists,
    filters: localFilters,
    setSearch,
    setGenre,
    setEra,
    setHasSongs,
    setSortBy,
    setSortOrder,
    clearFilters,
    isPending,
  };

  return (
    <ArtistListContext.Provider value={value}>
      {children}
    </ArtistListContext.Provider>
  );
}
