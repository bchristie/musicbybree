"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useCallback, useTransition } from "react";

export type SortOption = "artist" | "song";

export interface RepertoireFilters {
  search: string;
  tags: string[];
  keys: string[];
  artists: string[];
  statuses: string[];
  tempoMin: number | null;
  tempoMax: number | null;
  sort: SortOption;
}

export function useRepertoireFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse current filters from URL
  const filters = useMemo<RepertoireFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      keys: searchParams.get("keys")?.split(",").filter(Boolean) || [],
      artists: searchParams.get("artists")?.split(",").filter(Boolean) || [],
      statuses: searchParams.get("statuses")?.split(",").filter(Boolean) || [],
      tempoMin: searchParams.get("tempoMin") ? parseInt(searchParams.get("tempoMin")!) : null,
      tempoMax: searchParams.get("tempoMax") ? parseInt(searchParams.get("tempoMax")!) : null,
      sort: (searchParams.get("sort") as SortOption) || "artist",
    };
  }, [searchParams]);

  // Helper to update URL with new filters
  const updateFilters = useCallback(
    (updates: Partial<RepertoireFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Parse current filters from searchParams directly instead of using filters state
      const currentFilters: RepertoireFilters = {
        search: searchParams.get("search") || "",
        tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
        keys: searchParams.get("keys")?.split(",").filter(Boolean) || [],
        artists: searchParams.get("artists")?.split(",").filter(Boolean) || [],
        statuses: searchParams.get("statuses")?.split(",").filter(Boolean) || [],
        tempoMin: searchParams.get("tempoMin") ? parseInt(searchParams.get("tempoMin")!) : null,
        tempoMax: searchParams.get("tempoMax") ? parseInt(searchParams.get("tempoMax")!) : null,
        sort: (searchParams.get("sort") as SortOption) || "artist",
      };

      // Apply updates
      const newFilters = { ...currentFilters, ...updates };

      // Update each param
      if (newFilters.search) {
        params.set("search", newFilters.search);
      } else {
        params.delete("search");
      }

      if (newFilters.tags.length > 0) {
        params.set("tags", newFilters.tags.join(","));
      } else {
        params.delete("tags");
      }

      if (newFilters.keys.length > 0) {
        params.set("keys", newFilters.keys.join(","));
      } else {
        params.delete("keys");
      }

      if (newFilters.artists.length > 0) {
        params.set("artists", newFilters.artists.join(","));
      } else {
        params.delete("artists");
      }

      if (newFilters.statuses.length > 0) {
        params.set("statuses", newFilters.statuses.join(","));
      } else {
        params.delete("statuses");
      }

      if (newFilters.tempoMin !== null) {
        params.set("tempoMin", newFilters.tempoMin.toString());
      } else {
        params.delete("tempoMin");
      }

      if (newFilters.tempoMax !== null) {
        params.set("tempoMax", newFilters.tempoMax.toString());
      } else {
        params.delete("tempoMax");
      }

      if (newFilters.sort !== "artist") {
        params.set("sort", newFilters.sort);
      } else {
        params.delete("sort");
      }

      // Update URL without scrolling or adding to history
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Individual update functions
  const updateSearch = useCallback(
    (search: string) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  const toggleTag = useCallback(
    (tagId: string) => {
      const tags = filters.tags.includes(tagId)
        ? filters.tags.filter((t) => t !== tagId)
        : [...filters.tags, tagId];
      updateFilters({ tags });
    },
    [filters.tags, updateFilters]
  );

  const toggleKey = useCallback(
    (key: string) => {
      const keys = filters.keys.includes(key)
        ? filters.keys.filter((k) => k !== key)
        : [...filters.keys, key];
      updateFilters({ keys });
    },
    [filters.keys, updateFilters]
  );

  const toggleArtist = useCallback(
    (artistId: string) => {
      const artists = filters.artists.includes(artistId)
        ? filters.artists.filter((a) => a !== artistId)
        : [...filters.artists, artistId];
      updateFilters({ artists });
    },
    [filters.artists, updateFilters]
  );

  const toggleStatus = useCallback(
    (status: string) => {
      const statuses = filters.statuses.includes(status)
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status];
      updateFilters({ statuses });
    },
    [filters.statuses, updateFilters]
  );

  const setTempoRange = useCallback(
    (min: number | null, max: number | null) => {
      updateFilters({ tempoMin: min, tempoMax: max });
    },
    [updateFilters]
  );

  const setSort = useCallback(
    (sort: SortOption) => {
      updateFilters({ sort });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    updateFilters({
      search: "",
      tags: [],
      keys: [],
      artists: [],
      statuses: [],
      tempoMin: null,
      tempoMax: null,
      sort: "artist",
    });
  }, [updateFilters]);

  // Count active filters (excluding sort and search)
  const activeFilterCount = useMemo(() => {
    return (
      filters.tags.length +
      filters.keys.length +
      filters.artists.length +
      filters.statuses.length +
      (filters.tempoMin !== null || filters.tempoMax !== null ? 1 : 0)
    );
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0 || filters.search !== "";

  return {
    filters,
    updateSearch,
    toggleTag,
    toggleKey,
    toggleArtist,
    toggleStatus,
    setTempoRange,
    setSort,
    clearFilters,
    activeFilterCount,
    hasActiveFilters,
    isPending,
  };
}
