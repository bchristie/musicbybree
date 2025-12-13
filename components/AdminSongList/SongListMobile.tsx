"use client";

import { FileText, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSongList } from "./SongListProvider";

export function SongListMobile() {
  const router = useRouter();
  const { 
    paginatedSongs, 
    selectedIds, 
    toggleSelection,
    setArtist,
    filters,
  } = useSongList();

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
    if (filters.artist !== artistName) {
      setArtist(artistName);
    }
  };

  const handleArtistLinkClick = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    router.push(`/admin/artists/${artistId}`);
  };

  const handleCardClick = (songId: string, artistId: string) => {
    router.push(`/admin/artists/${artistId}/songs/${songId}`);
  };

  if (paginatedSongs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">No songs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paginatedSongs.map((song) => (
        <Card
          key={song.id}
          onClick={() => handleCardClick(song.id, song.artistId)}
          className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div onClick={(e) => e.stopPropagation()} className="pt-1">
              <Checkbox
                checked={selectedIds.has(song.id)}
                onCheckedChange={() => toggleSelection(song.id)}
                aria-label={`Select ${song.title}`}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              {/* Title and lyrics indicator */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100">
                  {song.title}
                </h3>
                {song.lyric ? (
                  <FileText className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-zinc-300 dark:text-zinc-700 flex-shrink-0" />
                )}
              </div>

              {/* Artist with link */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={(e) => handleArtistClick(e, song.artist.name)}
                  className="text-zinc-600 dark:text-zinc-400 hover:underline"
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

              {/* Tags */}
              {song.tags.length > 0 && (
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
              )}

              {/* Repertoire status */}
              {song.repertoireEntry && (
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(song.repertoireEntry.status)}`}>
                    {formatStatus(song.repertoireEntry.status)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
