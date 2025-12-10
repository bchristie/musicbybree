"use client";

import { Music2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ArtistSong } from "./types";

interface ArtistSongListProps {
  songs: ArtistSong[];
  artistName: string;
}

export function ArtistSongList({ songs, artistName }: ArtistSongListProps) {
  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (songs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Songs</CardTitle>
          <CardDescription>Songs in your repertoire by {artistName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Music2 className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-sm text-zinc-500">No songs yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Add songs by this artist to your repertoire
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Songs ({songs.length})</CardTitle>
        <CardDescription>Songs in your repertoire by {artistName}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop view */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Title</TableHead>
                <TableHead className="w-[15%]">Key</TableHead>
                <TableHead className="w-[20%]">Tempo</TableHead>
                <TableHead className="w-[15%] text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song) => (
                <TableRow key={song.id} className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>
                    {song.originalKey ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {song.originalKey}
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {song.tempo ? (
                      <span className="text-sm">{song.tempo} BPM</span>
                    ) : (
                      <span className="text-zinc-400 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatDuration(song.duration)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-3">
          {songs.map((song) => (
            <div
              key={song.id}
              className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer"
            >
              <h4 className="font-medium text-sm mb-2">{song.title}</h4>
              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                {song.originalKey && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {song.originalKey}
                  </span>
                )}
                {song.tempo && <span>{song.tempo} BPM</span>}
                {song.duration && <span>{formatDuration(song.duration)}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
