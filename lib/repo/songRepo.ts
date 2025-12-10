import prisma from "@/lib/prisma";
import { generateSongSlug, generateUniqueSlug } from "@/lib/slug";
import { cache } from "@/lib/cache";
import type { Song, Prisma } from "@prisma/client";

/**
 * Song Repository
 * Handles all database operations for Song model
 */

export const songRepo = {
  /**
   * Find all songs with optional includes
   */
  async findAll(options?: {
    includeArtist?: boolean;
    includeTags?: boolean;
    includePerformanceCount?: boolean;
  }) {
    const includeArtist = options?.includeArtist ?? true;
    const includeTags = options?.includeTags ?? true;
    const includePerformanceCount = options?.includePerformanceCount ?? false;

    return prisma.song.findMany({
      include: {
        artist: includeArtist,
        tags: includeTags ? {
          include: {
            tag: true,
          },
        } : undefined,
        _count: includePerformanceCount ? {
          select: { performances: true }
        } : undefined,
      },
      orderBy: { title: "asc" },
    });
  },

  /**
   * Find song by ID
   */
  async findById(id: string) {
    return prisma.song.findUnique({
      where: { id },
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
        performances: {
          include: {
            performance: true,
          },
        },
      },
    });
  },

  /**
   * Find songs by artist ID
   */
  async findByArtistId(artistId: string) {
    return prisma.song.findMany({
      where: { artistId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });
  },

  /**
   * Search songs by title
   */
  async search(query: string) {
    return prisma.song.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });
  },

  /**
   * Find songs by tag
   */
  async findByTag(tagId: string) {
    return prisma.song.findMany({
      where: {
        tags: {
          some: {
            tagId,
          },
        },
      },
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { title: "asc" },
    });
  },

  /**
   * Create a new song with auto-generated slug
   */
  async create(data: Omit<Prisma.SongCreateInput, "id">): Promise<Song> {
    // Get artist name for slug generation
    const artist = await prisma.artist.findUnique({
      where: { id: typeof data.artist === 'string' ? data.artist : (data.artist as any).connect?.id },
      select: { name: true },
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const baseSlug = generateSongSlug(artist.name, data.title);
    const existingSongs = await prisma.song.findMany({
      where: {
        id: {
          startsWith: baseSlug,
        },
      },
      select: { id: true },
    });
    const existingSlugs = existingSongs.map((s) => s.id);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    return prisma.song.create({
      data: {
        ...data,
        id: slug,
      },
    }).then((song) => {
      cache.revalidateSongs();
      return song;
    });
  },

  /**
   * Create a song with tags
   */
  async createWithTags(
    data: Omit<Prisma.SongCreateInput, "tags" | "id">,
    tagIds: string[]
  ) {
    // Get artist name for slug generation
    const artist = await prisma.artist.findUnique({
      where: { id: typeof data.artist === 'string' ? data.artist : (data.artist as any).connect?.id },
      select: { name: true },
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const baseSlug = generateSongSlug(artist.name, data.title);
    const existingSongs = await prisma.song.findMany({
      where: {
        id: {
          startsWith: baseSlug,
        },
      },
      select: { id: true },
    });
    const existingSlugs = existingSongs.map((s) => s.id);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    return prisma.song.create({
      data: {
        ...data,
        id: slug,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }).then((song) => {
      cache.revalidateSongs();
      return song;
    });
  },

  /**
   * Update a song
   */
  async update(id: string, data: Prisma.SongUpdateInput): Promise<Song> {
    return prisma.song.update({
      where: { id },
      data,
    }).then((song) => {
      cache.revalidateSong(id);
      return song;
    });
  },

  /**
   * Update song tags
   */
  async updateTags(id: string, tagIds: string[]) {
    // Delete existing tags and create new ones
    await prisma.songTag.deleteMany({
      where: { songId: id },
    });

    return prisma.song.update({
      where: { id },
      data: {
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },

  /**
   * Delete a song
   */
  async delete(id: string): Promise<Song> {
    return prisma.song.delete({
      where: { id },
    }).then((song) => {
      cache.revalidateSongs();
      return song;
    });
  },

  /**
   * Count total songs
   */
  async count(): Promise<number> {
    return prisma.song.count();
  },

  /**
   * Get songs for repertoire display
   */
  async findForRepertoire() {
    return prisma.song.findMany({
      include: {
        artist: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ artist: { name: "asc" } }, { title: "asc" }],
    });
  },
};
