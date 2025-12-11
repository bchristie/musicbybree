"use client";

import Link from "next/link";
import { Music2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  artistId: string;
}

export function ArtistSongList({ songs, artistName, artistId }: ArtistSongListProps) {
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Songs</CardTitle>
              <CardDescription>Songs in your repertoire by {artistName}</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/admin/artists/${artistId}/songs/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Song
              </Link>
            </Button>
          </div>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Songs ({songs.length})</CardTitle>
            <CardDescription>Songs in your repertoire by {artistName}</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/admin/artists/${artistId}/songs/new`}>
              <Plus className="w-4 h-4 mr-2" />
              Add Song
            </Link>
          </Button>
        </div>
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
              {songs.map((song) => {
                const status = song.repertoireEntry?.status;
                const getStatusBadge = () => {
                  if (!status) return null;
                  
                  const badges = {
                    FEATURED: { label: 'Featured', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
                    READY: { label: 'Ready', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
                    LEARNING: { label: 'Learning', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
                    ARCHIVED: { label: 'Archived', color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400' },
                  };
                  
                  const badge = badges[status as keyof typeof badges];
                  if (!badge) return null;
                  
                  return (
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  );
                };
                
                return (
                <TableRow 
                  key={song.id} 
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <TableCell className="font-medium">
                    <Link 
                      href={`/admin/artists/${artistId}/songs/${song.id}`}
                      className="hover:underline"
                    >
                      {song.title}
                    </Link>
                    {getStatusBadge()}
                  </TableCell>
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
              );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-3">
          {songs.map((song) => {
            const status = song.repertoireEntry?.status;
            const getStatusBadge = () => {
              if (!status) return null;
              
              const badges = {
                FEATURED: { label: 'Featured', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
                READY: { label: 'Ready', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
                LEARNING: { label: 'Learning', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
                ARCHIVED: { label: 'Archived', color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400' },
              };
              
              const badge = badges[status as keyof typeof badges];
              if (!badge) return null;
              
              return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              );
            };
            
            return (
            <Link
              key={song.id}
              href={`/admin/artists/${artistId}/songs/${song.id}`}
              className="block p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-sm">{song.title}</h4>
                {getStatusBadge()}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                {song.originalKey && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {song.originalKey}
                  </span>
                )}
                {song.tempo && <span>{song.tempo} BPM</span>}
                {song.duration && <span>{formatDuration(song.duration)}</span>}
              </div>
            </Link>
          );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
