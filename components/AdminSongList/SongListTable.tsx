"use client";

import { ArrowUpDown, ArrowUp, ArrowDown, FileText, ExternalLink } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useSongList } from "./SongListProvider";
import type { SongFilters } from "./types";

export function SongListTable() {
  const router = useRouter();
  const { 
    paginatedSongs, 
    filters, 
    setSortBy, 
    setSortOrder,
    selectedIds,
    toggleSelection,
    toggleAll,
    isAllSelected,
    hasAnySelected,
    setArtist,
  } = useSongList();

  const handleSort = (sortBy: SongFilters["sortBy"]) => {
    if (filters.sortBy === sortBy) {
      setSortOrder(filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortBy);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: SongFilters["sortBy"]) => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return filters.sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "LEARNING": return "Learning";
      case "READY": return "Ready";
      case "FEATURED": return "Featured";
      case "ARCHIVED": return "Archived";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LEARNING": 
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "READY": 
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "FEATURED": 
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "ARCHIVED": 
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
      default: 
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const handleArtistClick = (e: React.MouseEvent, artistName: string) => {
    e.stopPropagation();
    // Apply filter to current view
    if (filters.artist !== artistName) {
      setArtist(artistName);
    }
  };

  const handleArtistLinkClick = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    router.push(`/admin/artists/${artistId}`);
  };

  const handleRowClick = (songId: string, artistId: string) => {
    router.push(`/admin/artists/${artistId}/songs/${songId}`);
  };

  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected ? true : hasAnySelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[30%]">
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Song Title
                {getSortIcon("title")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">
              <Button
                variant="ghost"
                onClick={() => handleSort("artist")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Artist
                {getSortIcon("artist")}
              </Button>
            </TableHead>
            <TableHead className="w-[30%]">Tags</TableHead>
            <TableHead className="w-[10%] text-center">Lyrics</TableHead>
            <TableHead className="w-[10%]">
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSongs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                No songs found
              </TableCell>
            </TableRow>
          ) : (
            paginatedSongs.map((song) => (
              <TableRow
                key={song.id}
                onClick={() => handleRowClick(song.id, song.artistId)}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(song.id)}
                    onCheckedChange={() => toggleSelection(song.id)}
                    aria-label={`Select ${song.title}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {song.title}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleArtistClick(e, song.artist.name)}
                      className="text-zinc-900 dark:text-zinc-100 hover:underline text-left"
                    >
                      {song.artist.name}
                    </button>
                    <button
                      onClick={(e) => handleArtistLinkClick(e, song.artistId)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      title="View artist details"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  {song.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {song.tags.slice(0, 3).map((songTag) => (
                        <span
                          key={songTag.tag.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {songTag.tag.name}
                        </span>
                      ))}
                      {song.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          +{song.tags.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-400 text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {song.lyric ? (
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400 inline-block" />
                  ) : (
                    <FileText className="h-4 w-4 text-zinc-300 dark:text-zinc-700 inline-block" />
                  )}
                </TableCell>
                <TableCell>
                  {song.repertoireEntry ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(song.repertoireEntry.status)}`}>
                      {formatStatus(song.repertoireEntry.status)}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
