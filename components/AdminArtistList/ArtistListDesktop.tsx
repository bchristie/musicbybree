"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ArtistFilters } from "@/hooks/useAdminArtistFilters";

export type ArtistWithSongCount = {
  id: string;
  name: string;
  genre: string | null;
  era: string | null;
  description: string | null;
  _count?: { songs: number };
};

interface ArtistListDesktopProps {
  artists: ArtistWithSongCount[];
  filters: ArtistFilters;
  onSort: (sortBy: ArtistFilters["sortBy"]) => void;
  onSelect: (artistId: string) => void;
}

export function ArtistListDesktop({
  artists,
  filters,
  onSort,
  onSelect,
}: ArtistListDesktopProps) {
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
            <TableHead className="w-[40%]">
              <Button
                variant="ghost"
                onClick={() => onSort("name")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Artist Name
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">
              <Button
                variant="ghost"
                onClick={() => onSort("genre")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Genre
                {getSortIcon("genre")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">
              <Button
                variant="ghost"
                onClick={() => onSort("era")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Era
                {getSortIcon("era")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%] text-right">
              <Button
                variant="ghost"
                onClick={() => onSort("songCount")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Songs
                {getSortIcon("songCount")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            artists.map((artist) => (
              <TableRow
                key={artist.id}
                onClick={() => onSelect(artist.id)}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <TableCell className="font-medium">{artist.name}</TableCell>
                <TableCell>
                  {artist.genre ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {artist.genre}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-sm">—</span>
                  )}
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
                    {artist._count?.songs ?? 0} song{artist._count?.songs !== 1 ? 's' : ''}
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
