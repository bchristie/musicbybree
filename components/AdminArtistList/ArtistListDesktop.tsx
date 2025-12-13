"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useArtistList } from "./ArtistListProvider";
import type { ArtistFilters } from "./types";

export function ArtistListDesktop() {
  const router = useRouter();
  const { filteredArtists, filters, setSortBy, setSortOrder } = useArtistList();

  const handleSort = (sortBy: ArtistFilters["sortBy"]) => {
    if (filters.sortBy === sortBy) {
      // Toggle sort order
      setSortOrder(filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New sort column, default to ascending
      setSortBy(sortBy);
      setSortOrder("asc");
    }
  };

  const handleSelect = (artistId: string) => {
    router.push(`/admin/artists/${artistId}`);
  };

  const getSortIcon = (column: ArtistFilters["sortBy"]) => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return filters.sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Artist Name
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">
              <Button
                variant="ghost"
                onClick={() => handleSort("era")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Era
                {getSortIcon("era")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%] text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("songCount")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Songs
                {getSortIcon("songCount")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredArtists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            filteredArtists.map((artist) => (
              <TableRow
                key={artist.id}
                onClick={() => handleSelect(artist.id)}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <TableCell>
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {artist.name}
                    </div>
                    {artist.genre && (
                      <div className="flex flex-wrap gap-0.5 justify-end">
                        {artist.genre.split(',').map((g, i) => {
                          const genre = g.trim();
                          return genre ? (
                            <span
                              key={i}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.65rem] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              {genre}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {artist.era ? (
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {artist.era}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 text-xs font-medium bg-zinc-100 text-zinc-700 rounded dark:bg-zinc-800 dark:text-zinc-300">
                    {artist._count.songs} song{artist._count.songs !== 1 ? 's' : ''}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
