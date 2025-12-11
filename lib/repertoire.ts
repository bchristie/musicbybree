/**
 * Type exports for RepertoireEntry
 */

import type { RepertoireEntry, RepertoireStatus } from "@prisma/client";

export type { RepertoireEntry, RepertoireStatus };

/**
 * Song with repertoire entry included
 */
export type SongWithRepertoire = {
  id: string;
  title: string;
  artistId: string;
  originalKey: string | null;
  tempo: number | null;
  duration: number | null;
  repertoireEntry: RepertoireEntry | null;
};

/**
 * Helper to check if a song is in the active repertoire
 */
export function isInRepertoire(song: { repertoireEntry?: RepertoireEntry | null }): boolean {
  return song.repertoireEntry !== null && song.repertoireEntry !== undefined;
}

/**
 * Helper to check if a song is performance-ready (for public display)
 */
export function isPerformanceReady(song: { repertoireEntry?: RepertoireEntry | null }): boolean {
  if (!song.repertoireEntry) return false;
  return song.repertoireEntry.status === "READY" || song.repertoireEntry.status === "FEATURED";
}

/**
 * Get display key (performed key if set, otherwise original key)
 */
export function getDisplayKey(song: {
  originalKey?: string | null;
  repertoireEntry?: { performedKey?: string | null } | null;
}): string | null {
  return song.repertoireEntry?.performedKey || song.originalKey || null;
}

/**
 * Get display tempo (performed tempo if set, otherwise original tempo)
 */
export function getDisplayTempo(song: {
  tempo?: number | null;
  repertoireEntry?: { performedTempo?: number | null } | null;
}): number | null {
  return song.repertoireEntry?.performedTempo || song.tempo || null;
}

/**
 * Get display duration (typical duration if set, otherwise original duration)
 */
export function getDisplayDuration(song: {
  duration?: number | null;
  repertoireEntry?: { typicalDuration?: number | null } | null;
}): number | null {
  return song.repertoireEntry?.typicalDuration || song.duration || null;
}

/**
 * Status badge color helper
 */
export function getStatusColor(status: RepertoireStatus): string {
  switch (status) {
    case "LEARNING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "READY":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "FEATURED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

/**
 * Status display name
 */
export function getStatusLabel(status: RepertoireStatus): string {
  switch (status) {
    case "LEARNING":
      return "Learning";
    case "READY":
      return "Ready";
    case "FEATURED":
      return "Featured";
    case "ARCHIVED":
      return "Archived";
  }
}
