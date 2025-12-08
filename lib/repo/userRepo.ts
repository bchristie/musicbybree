import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User, Prisma } from "@prisma/client";

/**
 * User Repository
 * Handles all database operations for User model (authentication)
 */

export const userRepo = {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Create a new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  /**
   * Create user with hashed password
   */
  async createWithHashedPassword(
    email: string,
    password: string,
    name?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  },

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Update user password
   */
  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  },

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  },

  /**
   * Upsert user (used for seeding)
   */
  async upsert(
    email: string,
    password: string,
    name?: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
      },
      create: {
        email,
        password: hashedPassword,
        name,
      },
    });
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Count total users
   */
  async count(): Promise<number> {
    return prisma.user.count();
  },
};
