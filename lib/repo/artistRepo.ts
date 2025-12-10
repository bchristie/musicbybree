import prisma from "@/lib/prisma";
import { generateArtistSlug, generateUniqueSlug } from "@/lib/slug";
import { cache } from "@/lib/cache";
import type { Artist, Prisma } from "@prisma/client";

/**
 * Artist Repository
 * Handles all database operations for Artist model
 */

export const artistRepo = {
  /**
   * Find all artists with optional includes
   */
  async findAll(options?: {
    includeSongCount?: boolean;
  }) {
    return prisma.artist.findMany({
      orderBy: { name: "asc" },
      include: options?.includeSongCount ? {
        _count: {
          select: { songs: true }
        }
      } : undefined,
    });
  },

  /**
   * Find artist by ID
   */
  async findById(id: string): Promise<Artist | null> {
    return prisma.artist.findUnique({
      where: { id },
    });
  },

  /**
   * Find artist by name
   */
  async findByName(name: string): Promise<Artist | null> {
    return prisma.artist.findUnique({
      where: { name },
    });
  },

  /**
   * Find artist by ID with songs
   */
  async findByIdWithSongs(id: string) {
    return prisma.artist.findUnique({
      where: { id },
      include: {
        songs: {
          orderBy: { title: "asc" },
        },
      },
    });
  },

  /**
   * Search artists by name
   */
  async search(query: string): Promise<Artist[]> {
    return prisma.artist.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Create a new artist with auto-generated slug
   */
  async create(data: Omit<Prisma.ArtistCreateInput, "id">): Promise<Artist> {
    const baseSlug = generateArtistSlug(data.name);
    const existingArtists = await prisma.artist.findMany({
      where: {
        id: {
          startsWith: baseSlug,
        },
      },
      select: { id: true },
    });
    const existingSlugs = existingArtists.map((a) => a.id);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    return prisma.artist.create({
      data: {
        ...data,
        id: slug,
      },
    }).then((artist) => {
      cache.revalidateArtists();
      return artist;
    });
  },

  /**
   * Update an artist
   */
  async update(id: string, data: Prisma.ArtistUpdateInput): Promise<Artist> {
    return prisma.artist.update({
      where: { id },
      data,
    });
  },

  /**
   * Upsert an artist (create or update)
   */
  async upsert(
    name: string,
    data: Prisma.ArtistCreateInput
  ): Promise<Artist> {
    return prisma.artist.upsert({
      where: { name },
      update: data,
      create: data,
    });
  },

  /**
   * Delete an artist
   */
  async delete(id: string): Promise<Artist> {
    return prisma.artist.delete({
      where: { id },
    });
  },

  /**
   * Count total artists
   */
  async count(): Promise<number> {
    return prisma.artist.count();
  },

  /**
   * Get artists with song counts
   */
  async findAllWithSongCounts() {
    return prisma.artist.findMany({
      include: {
        _count: {
          select: { songs: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },
};
