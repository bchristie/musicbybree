"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRepertoireFilters, type SortOption } from "@/hooks/useRepertoireFilters";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  onFilterClick: () => void;
}

export function SearchBar({ onFilterClick }: SearchBarProps) {
  const { filters, updateSearch, setSort, clearFilters, activeFilterCount, hasActiveFilters } =
    useRepertoireFilters();

  const [searchValue, setSearchValue] = useState(filters.search);
  const updateSearchRef = useRef(updateSearch);

  // Keep ref up to date
  useEffect(() => {
    updateSearchRef.current = updateSearch;
  }, [updateSearch]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchRef.current(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]); // Only depend on searchValue

  // Sync with URL changes
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const handleClearSearch = useCallback(() => {
    setSearchValue("");
  }, []);

  return (
    <div className="sticky top-16 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search songs or artists..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 text-zinc-900 dark:text-zinc-50 cursor-pointer"
          >
            <option value="artist">By Artist</option>
            <option value="song">By Song</option>
          </select>

          {/* Filter Button (mobile/tablet) */}
          <button
            onClick={onFilterClick}
            className="lg:hidden relative px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-semibold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear All Filters (when active) */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
