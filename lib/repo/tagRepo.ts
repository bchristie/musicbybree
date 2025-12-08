import prisma from "@/lib/prisma";
import type { Tag, Prisma } from "@prisma/client";

/**
 * Tag Repository
 * Handles all database operations for Tag model
 */

export const tagRepo = {
  /**
   * Find all tags
   */
  async findAll(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  },

  /**
   * Find tag by ID
   */
  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  },

  /**
   * Find tag by name
   */
  async findByName(name: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { name },
    });
  },

  /**
   * Find tags by category
   */
  async findByCategory(category: string): Promise<Tag[]> {
    return prisma.tag.findMany({
      where: { category },
      orderBy: { name: "asc" },
    });
  },

  /**
   * Find tag by ID with songs
   */
  async findByIdWithSongs(id: string) {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: {
              include: {
                artist: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const tags = await prisma.tag.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return tags.map((t) => t.category);
  },

  /**
   * Create a new tag
   */
  async create(data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.create({
      data,
    });
  },

  /**
   * Update a tag
   */
  async update(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
    return prisma.tag.update({
      where: { id },
      data,
    });
  },

  /**
   * Upsert a tag (create or update)
   */
  async upsert(name: string, data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.upsert({
      where: { name },
      update: data,
      create: data,
    });
  },

  /**
   * Delete a tag
   */
  async delete(id: string): Promise<Tag> {
    return prisma.tag.delete({
      where: { id },
    });
  },

  /**
   * Count total tags
   */
  async count(): Promise<number> {
    return prisma.tag.count();
  },

  /**
   * Get tags with song counts
   */
  async findAllWithSongCounts() {
    return prisma.tag.findMany({
      include: {
        _count: {
          select: { songs: true },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  },

  /**
   * Get tags grouped by category
   */
  async findAllGroupedByCategory() {
    const tags = await prisma.tag.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return tags.reduce(
      (acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      },
      {} as Record<string, Tag[]>
    );
  },
};
