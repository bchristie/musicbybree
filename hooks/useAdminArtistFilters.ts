"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useTransition, useRef, useEffect } from "react";

export type ArtistFilters = {
  search: string;
  genre: string;
  era: string;
  hasSongs: string; // "all", "yes", "no"
  sortBy: "name" | "genre" | "era" | "songCount";
  sortOrder: "asc" | "desc";
};

export function useAdminArtistFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Parse current filters from URL
  const filters: ArtistFilters = {
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    era: searchParams.get("era") || "",
    hasSongs: searchParams.get("hasSongs") || "all",
    sortBy: (searchParams.get("sortBy") as ArtistFilters["sortBy"]) || "name",
    sortOrder: (searchParams.get("sortOrder") as ArtistFilters["sortOrder"]) || "asc",
  };

  // Update URL with new filters
  const updateFilters = useCallback(
    (updates: Partial<ArtistFilters>, debounce = false) => {
      const updateURL = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Apply updates
        Object.entries(updates).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        });

        // Use replace to avoid polluting history
        startTransition(() => {
          router.replace(`?${params.toString()}`, { scroll: false });
        });
      };

      if (debounce) {
        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        // Set new timer
        debounceTimerRef.current = setTimeout(updateURL, 300);
      } else {
        updateURL();
      }
    },
    [searchParams, router]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.replace(window.location.pathname, { scroll: false });
    });
  }, [router]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    filters,
    updateFilters,
    clearFilters,
    isPending,
  };
}
