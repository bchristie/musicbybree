/**
 * Slug generation utilities for creating URL-friendly identifiers
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Generate a slug for an artist
 * @param name - Artist name
 * @returns Slugified artist name
 */
export function generateArtistSlug(name: string): string {
  return slugify(name);
}

/**
 * Generate a slug for a tag
 * @param name - Tag name
 * @returns Slugified tag name
 */
export function generateTagSlug(name: string): string {
  return slugify(name);
}

/**
 * Generate a slug for a song (artist + song title)
 * @param artistName - Artist name
 * @param songTitle - Song title
 * @returns Compound slug in format: artist-song-title
 */
export function generateSongSlug(artistName: string, songTitle: string): string {
  const artistSlug = slugify(artistName);
  const songSlug = slugify(songTitle);
  return `${artistSlug}-${songSlug}`;
}

/**
 * Generate a unique slug by appending a number if needed
 * @param baseSlug - The base slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
