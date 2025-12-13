"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useTransition, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { SongWithRelations, SongFilters, SongListContextValue } from "./types";

const SongListContext = createContext<SongListContextValue | null>(null);

export function useSongList() {
  const context = useContext(SongListContext);
  if (!context) {
    throw new Error("useSongList must be used within SongListProvider");
  }
  return context;
}

interface SongListProviderProps {
  initialSongs: SongWithRelations[];
  children: React.ReactNode;
}

export function SongListProvider({ initialSongs, children }: SongListProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Parse tags from URL (comma-separated)
  const parseTagsFromUrl = (tagsParam: string | null): string[] => {
    if (!tagsParam) return [];
    return tagsParam.split(',').filter(Boolean);
  };

  // Local state for immediate UI updates
  const [localFilters, setLocalFilters] = useState<SongFilters>(() => ({
    search: searchParams.get("search") || "",
    artist: searchParams.get("artist") || "",
    tags: parseTagsFromUrl(searchParams.get("tags")),
    repertoireStatus: searchParams.get("status") || "all",
    hasLyrics: searchParams.get("lyrics") || "all",
    sortBy: (searchParams.get("sortBy") as SongFilters["sortBy"]) || "title",
    sortOrder: (searchParams.get("sortOrder") as SongFilters["sortOrder"]) || "asc",
    page: parseInt(searchParams.get("page") || "1"),
    perPage: parseInt(searchParams.get("perPage") || "20"),
  }));

  // Selection state (persists across pagination)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Timer for batched URL updates
  const urlUpdateTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync URL to local state when user navigates (back/forward)
  useEffect(() => {
    setLocalFilters({
      search: searchParams.get("search") || "",
      artist: searchParams.get("artist") || "",
      tags: parseTagsFromUrl(searchParams.get("tags")),
      repertoireStatus: searchParams.get("status") || "all",
      hasLyrics: searchParams.get("lyrics") || "all",
      sortBy: (searchParams.get("sortBy") as SongFilters["sortBy"]) || "title",
      sortOrder: (searchParams.get("sortOrder") as SongFilters["sortOrder"]) || "asc",
      page: parseInt(searchParams.get("page") || "1"),
      perPage: parseInt(searchParams.get("perPage") || "20"),
    });
  }, [searchParams]);

  // Update URL (batched and debounced)
  const updateURL = useCallback((filters: SongFilters, immediate = false) => {
    const doUpdate = () => {
      const params = new URLSearchParams();
      
      if (filters.search) params.set("search", filters.search);
      if (filters.artist) params.set("artist", filters.artist);
      if (filters.tags.length > 0) params.set("tags", filters.tags.join(','));
      if (filters.repertoireStatus !== "all") params.set("status", filters.repertoireStatus);
      if (filters.hasLyrics !== "all") params.set("lyrics", filters.hasLyrics);
      if (filters.sortBy !== "title") params.set("sortBy", filters.sortBy);
      if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder);
      if (filters.page !== 1) params.set("page", filters.page.toString());
      if (filters.perPage !== 20) params.set("perPage", filters.perPage.toString());

      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    };

    if (immediate) {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
      doUpdate();
    } else {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
      urlUpdateTimerRef.current = setTimeout(doUpdate, 100);
    }
  }, [router]);

  // Filter update handlers
  const setSearch = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, search: value, page: 1 }; // Reset to page 1 on search
      updateURL(next, false);
      return next;
    });
  }, [updateURL]);

  const setArtist = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, artist: value, page: 1 };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setTags = useCallback((value: string[]) => {
    setLocalFilters(prev => {
      const next = { ...prev, tags: value, page: 1 };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setRepertoireStatus = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, repertoireStatus: value, page: 1 };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setHasLyrics = useCallback((value: string) => {
    setLocalFilters(prev => {
      const next = { ...prev, hasLyrics: value, page: 1 };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setSortBy = useCallback((sortBy: SongFilters["sortBy"]) => {
    setLocalFilters(prev => {
      const next = { ...prev, sortBy };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setSortOrder = useCallback((sortOrder: SongFilters["sortOrder"]) => {
    setLocalFilters(prev => {
      const next = { ...prev, sortOrder };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setPage = useCallback((page: number) => {
    setLocalFilters(prev => {
      const next = { ...prev, page };
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const setPerPage = useCallback((perPage: number) => {
    setLocalFilters(prev => {
      const next = { ...prev, perPage, page: 1 }; // Reset to page 1 when changing page size
      updateURL(next, true);
      return next;
    });
  }, [updateURL]);

  const clearFilters = useCallback(() => {
    const defaultFilters: SongFilters = {
      search: "",
      artist: "",
      tags: [],
      repertoireStatus: "all",
      hasLyrics: "all",
      sortBy: "title",
      sortOrder: "asc",
      page: 1,
      perPage: 20,
    };
    setLocalFilters(defaultFilters);
    startTransition(() => {
      router.replace(window.location.pathname, { scroll: false });
    });
  }, [router]);

  // Selection handlers
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds(prev => {
      // If all current page items are selected, deselect them
      // Otherwise, select all current page items
      const pageIds = paginatedSongs.map(s => s.id);
      const allPageSelected = pageIds.every(id => prev.has(id));
      
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach(id => next.delete(id));
      } else {
        pageIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, []); // Will be updated when paginatedSongs is defined

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Apply filters and sorting
  const filteredSongs = useMemo(() => {
    let filtered = [...initialSongs];

    // Apply search filter
    if (localFilters.search) {
      const searchLower = localFilters.search.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply artist filter
    if (localFilters.artist) {
      const artistLower = localFilters.artist.toLowerCase();
      filtered = filtered.filter(song => 
        song.artist.name.toLowerCase().includes(artistLower)
      );
    }

    // Apply tags filter (song must have ALL selected tags)
    if (localFilters.tags.length > 0) {
      filtered = filtered.filter(song => {
        const songTagIds = song.tags.map(t => t.tag.id);
        return localFilters.tags.every(tagId => songTagIds.includes(tagId));
      });
    }

    // Apply repertoire status filter
    if (localFilters.repertoireStatus !== "all") {
      if (localFilters.repertoireStatus === "none") {
        filtered = filtered.filter(song => !song.repertoireEntry);
      } else {
        filtered = filtered.filter(song => 
          song.repertoireEntry?.status === localFilters.repertoireStatus
        );
      }
    }

    // Apply hasLyrics filter
    if (localFilters.hasLyrics === "yes") {
      filtered = filtered.filter(song => song.lyric !== null);
    } else if (localFilters.hasLyrics === "no") {
      filtered = filtered.filter(song => song.lyric === null);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (localFilters.sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "artist":
          comparison = a.artist.name.localeCompare(b.artist.name);
          break;
        case "status":
          const aStatus = a.repertoireEntry?.status || "";
          const bStatus = b.repertoireEntry?.status || "";
          comparison = aStatus.localeCompare(bStatus);
          break;
      }

      return localFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [initialSongs, localFilters]);

  // Apply pagination
  const paginatedSongs = useMemo(() => {
    const start = (localFilters.page - 1) * localFilters.perPage;
    const end = start + localFilters.perPage;
    return filteredSongs.slice(start, end);
  }, [filteredSongs, localFilters.page, localFilters.perPage]);

  const totalPages = Math.ceil(filteredSongs.length / localFilters.perPage);

  // Check selection states
  const isAllSelected = useMemo(() => {
    return filteredSongs.length > 0 && filteredSongs.every(song => selectedIds.has(song.id));
  }, [filteredSongs, selectedIds]);

  const isPageSelected = useMemo(() => {
    return paginatedSongs.length > 0 && paginatedSongs.every(song => selectedIds.has(song.id));
  }, [paginatedSongs, selectedIds]);

  const hasAnySelected = useMemo(() => {
    return selectedIds.size > 0;
  }, [selectedIds]);

  // Update toggleAll dependency on paginatedSongs
  const toggleAllUpdated = useCallback(() => {
    const pageIds = paginatedSongs.map(s => s.id);
    const anyPageSelected = pageIds.some(id => selectedIds.has(id));
    
    // If any items on current page are selected, clear ALL selections
    if (anyPageSelected) {
      setSelectedIds(new Set());
    } else {
      // Otherwise, add all items on current page to selection
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageIds.forEach(id => next.add(id));
        return next;
      });
    }
  }, [paginatedSongs, selectedIds]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (urlUpdateTimerRef.current) {
        clearTimeout(urlUpdateTimerRef.current);
      }
    };
  }, []);

  const value: SongListContextValue = {
    songs: initialSongs,
    filteredSongs,
    paginatedSongs,
    totalPages,
    filters: localFilters,
    setSearch,
    setArtist,
    setTags,
    setRepertoireStatus,
    setHasLyrics,
    setSortBy,
    setSortOrder,
    setPage,
    setPerPage,
    clearFilters,
    selectedIds,
    toggleSelection,
    toggleAll: toggleAllUpdated,
    clearSelection,
    isAllSelected,
    isPageSelected,
    hasAnySelected,
    isPending,
  };

  return (
    <SongListContext.Provider value={value}>
      {children}
    </SongListContext.Provider>
  );
}
