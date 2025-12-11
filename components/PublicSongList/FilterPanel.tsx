"use client";

import { useEffect, useState } from "react";
import type { Artist, Tag } from "@prisma/client";
import { useRepertoireFilters } from "@/hooks/useRepertoireFilters";
import { X, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  tags: Map<string, Tag[]>;
  keys: string[];
  artists: Artist[];
  layout: "mobile" | "sidebar";
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterPanel({ tags, keys, artists, layout, isOpen = false, onClose }: FilterPanelProps) {
  const {
    filters,
    toggleTag,
    toggleKey,
    toggleArtist,
    toggleStatus,
    setTempoRange,
    clearFilters,
    hasActiveFilters,
  } = useRepertoireFilters();

  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['status']));

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (layout === "mobile" && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, layout]);

  const FilterContent = () => (
    <div className="space-y-2">
      {/* Header (mobile only) */}
      {layout === "mobile" && (
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Status - First and Default Open */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => toggleSection('status')}
          className="flex items-center justify-between w-full py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded px-2 transition-colors"
        >
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase">Status</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has('status') ? 'rotate-180' : ''}`} />
        </button>
        {openSections.has('status') && (
          <div className="space-y-1.5 mt-2 px-2">
            {[
              { value: 'FEATURED', label: 'Featured', color: 'text-amber-600 dark:text-amber-400' },
              { value: 'READY', label: 'Ready', color: 'text-green-600 dark:text-green-400' },
            ].map(({ value, label, color }) => {
              const isActive = filters.statuses.includes(value);
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleStatus(value)}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                  />
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags by Category */}
      {Array.from(tags.entries()).map(([category, categoryTags]) => (
        <div key={category} className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => toggleSection(category)}
            className="flex items-center justify-between w-full py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded px-2 transition-colors"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase">
              {category}
            </h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has(category) ? 'rotate-180' : ''}`} />
          </button>
          {openSections.has(category) && (
            <div className="space-y-1.5 mt-2 px-2">
              {categoryTags.map((tag) => {
                const isActive = filters.tags.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleTag(tag.id)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{tag.name}</span>
                    {tag.color && (
                      <span
                        className="w-3 h-3 rounded-full ml-auto"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Keys */}
      {keys.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => toggleSection('keys')}
            className="flex items-center justify-between w-full py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded px-2 transition-colors"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase">Key</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has('keys') ? 'rotate-180' : ''}`} />
          </button>
          {openSections.has('keys') && (
            <div className="flex flex-wrap gap-2 mt-2 px-2">
              {keys.map((key) => {
                const isActive = filters.keys.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleKey(key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      isActive
                        ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Artists */}
      {artists.length > 0 && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => toggleSection('artists')}
            className="flex items-center justify-between w-full py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded px-2 transition-colors"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase">Artist</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has('artists') ? 'rotate-180' : ''}`} />
          </button>
          {openSections.has('artists') && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto mt-2 px-2">
              {artists.map((artist) => {
                const isActive = filters.artists.includes(artist.id);
                return (
                  <label
                    key={artist.id}
                    className="flex items-center gap-2 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleArtist(artist.id)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{artist.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tempo Range */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => toggleSection('tempo')}
          className="flex items-center justify-between w-full py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded px-2 transition-colors"
        >
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase">Tempo (BPM)</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.has('tempo') ? 'rotate-180' : ''}`} />
        </button>
        {openSections.has('tempo') && (
          <div className="space-y-2 mt-2 px-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.tempoMin ?? ""}
                onChange={(e) =>
                  setTempoRange(
                    e.target.value ? parseInt(e.target.value) : null,
                    filters.tempoMax
                  )
                }
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.tempoMax ?? ""}
                onChange={(e) =>
                  setTempoRange(
                    filters.tempoMin,
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTempoRange(0, 80)}
                className="flex-1 px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              >
                Slow
              </button>
              <button
                onClick={() => setTempoRange(81, 120)}
                className="flex-1 px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              >
                Medium
              </button>
              <button
                onClick={() => setTempoRange(121, 200)}
                className="flex-1 px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
              >
                Fast
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (layout === "sidebar") {
    // Desktop persistent sidebar
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <FilterContent />
      </div>
    );
  }

  // Mobile: Slide-up drawer
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-up panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 z-50 transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "75vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        </div>

        <div className="overflow-y-auto px-4 pb-6" style={{ maxHeight: "calc(75vh - 3rem)" }}>
          <FilterContent />
        </div>
      </div>
    </>
  );
}
