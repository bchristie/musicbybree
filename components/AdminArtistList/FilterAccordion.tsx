"use client";

import { ChevronDown, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ArtistFilters } from "@/hooks/useAdminArtistFilters";

interface FilterAccordionProps {
  filters: ArtistFilters;
  onFilterChange: (updates: Partial<ArtistFilters>) => void;
  onClearFilters: () => void;
  availableGenres: string[];
  availableEras: string[];
}

export function FilterAccordion({
  filters,
  onFilterChange,
  onClearFilters,
  availableGenres,
  availableEras,
}: FilterAccordionProps) {
  const hasActiveFilters =
    filters.genre || filters.era || filters.hasSongs !== "all";

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="filters" className="border-none">
        <div className="flex items-center justify-between">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center h-5 px-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                  Active
                </span>
              )}
            </div>
          </AccordionTrigger>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className="text-xs h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <AccordionContent className="pt-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div className="space-y-2 flex-1">
              <Label htmlFor="genre-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Genre
              </Label>
              <Select
                value={filters.genre || "all"}
                onValueChange={(value) =>
                  onFilterChange({ genre: value === "all" ? "" : value })
                }
              >
                <SelectTrigger id="genre-filter" className="w-full">
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genres</SelectItem>
                  {availableGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Era Filter */}
            <div className="space-y-2 flex-1">
              <Label htmlFor="era-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Era
              </Label>
              <Select
                value={filters.era || "all"}
                onValueChange={(value) =>
                  onFilterChange({ era: value === "all" ? "" : value })
                }
              >
                <SelectTrigger id="era-filter" className="w-full">
                  <SelectValue placeholder="All eras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All eras</SelectItem>
                  {availableEras.map((era) => (
                    <SelectItem key={era} value={era}>
                      {era}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Has Songs Filter */}
            <div className="space-y-2 flex-1">
              <Label htmlFor="songs-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Has Songs
              </Label>
              <Select
                value={filters.hasSongs}
                onValueChange={(value) => onFilterChange({ hasSongs: value })}
              >
                <SelectTrigger id="songs-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All artists</SelectItem>
                  <SelectItem value="yes">With songs</SelectItem>
                  <SelectItem value="no">Without songs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
