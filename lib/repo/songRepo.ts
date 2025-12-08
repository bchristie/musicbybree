import prisma from "@/lib/prisma";
import type { Song, Prisma } from "@prisma/client";

/**
 * Song Repository
 * Handles all database operations for Song model
 */

export const songRepo = {
  /**
   * Find all songs
   */
  async findAll() {
    return prisma.song.findMany({
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
   * Create a new song
   */
  async create(data: Prisma.SongCreateInput): Promise<Song> {
    return prisma.song.create({
      data,
    });
  },

  /**
   * Create a song with tags
   */
  async createWithTags(
    data: Omit<Prisma.SongCreateInput, "tags">,
    tagIds: string[]
  ) {
    return prisma.song.create({
      data: {
        ...data,
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
   * Update a song
   */
  async update(id: string, data: Prisma.SongUpdateInput): Promise<Song> {
    return prisma.song.update({
      where: { id },
      data,
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
