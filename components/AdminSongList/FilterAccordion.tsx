"use client";

import { X } from "lucide-react";
import { useMemo } from "react";
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
import { useSongList } from "./SongListProvider";

export function FilterAccordion() {
  const { 
    songs, 
    filters, 
    setArtist, 
    setTags, 
    setRepertoireStatus, 
    setHasLyrics, 
    clearFilters 
  } = useSongList();

  // Extract unique artists and tags from all songs
  const { availableArtists, availableTags } = useMemo(() => {
    const artists = new Set<string>();
    const tags = new Map<string, { id: string; name: string; category: string }>();

    songs.forEach((song) => {
      artists.add(song.artist.name);
      song.tags.forEach((songTag) => {
        tags.set(songTag.tag.id, {
          id: songTag.tag.id,
          name: songTag.tag.name,
          category: songTag.tag.category,
        });
      });
    });

    return {
      availableArtists: Array.from(artists).sort(),
      availableTags: Array.from(tags.values()).sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [songs]);

  const hasActiveFilters =
    filters.artist ||
    filters.tags.length > 0 ||
    filters.repertoireStatus !== "all" ||
    filters.hasLyrics !== "all";

  // Helper to format repertoire status
  const formatStatus = (status: string) => {
    switch (status) {
      case "LEARNING": return "Learning";
      case "READY": return "Ready";
      case "FEATURED": return "Featured";
      case "ARCHIVED": return "Archived";
      case "none": return "Not in Repertoire";
      default: return "All";
    }
  };

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
                clearFilters();
              }}
              className="text-xs h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <AccordionContent className="pt-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Artist Filter */}
            <div className="space-y-2">
              <Label htmlFor="artist-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Artist
              </Label>
              <Select
                value={filters.artist || "all"}
                onValueChange={(value) => setArtist(value === "all" ? "" : value)}
              >
                <SelectTrigger id="artist-filter" className="w-full">
                  <SelectValue placeholder="All artists" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All artists</SelectItem>
                  {availableArtists.map((artist) => (
                    <SelectItem key={artist} value={artist}>
                      {artist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter (simple dropdown for now) */}
            <div className="space-y-2">
              <Label htmlFor="tags-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Tag
              </Label>
              <Select
                value={filters.tags[0] || "all"}
                onValueChange={(value) => setTags(value === "all" ? [] : [value])}
              >
                <SelectTrigger id="tags-filter" className="w-full">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name} {tag.category !== "general" && `(${tag.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Repertoire Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Repertoire Status
              </Label>
              <Select
                value={filters.repertoireStatus}
                onValueChange={setRepertoireStatus}
              >
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="LEARNING">{formatStatus("LEARNING")}</SelectItem>
                  <SelectItem value="READY">{formatStatus("READY")}</SelectItem>
                  <SelectItem value="FEATURED">{formatStatus("FEATURED")}</SelectItem>
                  <SelectItem value="ARCHIVED">{formatStatus("ARCHIVED")}</SelectItem>
                  <SelectItem value="none">{formatStatus("none")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Has Lyrics Filter */}
            <div className="space-y-2">
              <Label htmlFor="lyrics-filter" className="text-xs text-zinc-600 dark:text-zinc-400">
                Has Lyrics
              </Label>
              <Select
                value={filters.hasLyrics}
                onValueChange={setHasLyrics}
              >
                <SelectTrigger id="lyrics-filter" className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
