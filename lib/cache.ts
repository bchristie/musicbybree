import { revalidatePath } from "next/cache";

/**
 * Cache revalidation utilities for invalidating Next.js cache
 * Call these after database mutations to ensure fresh data
 */

export const cache = {
  /**
   * Revalidate all song-related pages
   */
  revalidateSongs() {
    revalidatePath("/repertoire");
    revalidatePath("/songs/[id]", "page");
  },

  /**
   * Revalidate a specific song detail page
   */
  revalidateSong(songId: string) {
    revalidatePath(`/songs/${songId}`);
    revalidatePath("/repertoire");
  },

  /**
   * Revalidate all artist-related pages
   */
  revalidateArtists() {
    revalidatePath("/repertoire");
  },

  /**
   * Revalidate all tag-related pages
   */
  revalidateTags() {
    revalidatePath("/repertoire");
  },

  /**
   * Revalidate all performance pages
   */
  revalidatePerformances() {
    revalidatePath("/performances");
  },

  /**
   * Revalidate everything (use sparingly)
   */
  revalidateAll() {
    revalidatePath("/", "layout");
  },
};
