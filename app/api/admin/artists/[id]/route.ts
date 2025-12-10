import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { artistRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ id: string }>;

/**
 * GET /api/admin/artists/[id]
 * Get a single artist by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const artist = await artistRepo.findById(id);

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error(`[API] Error fetching artist:`, error);
    return NextResponse.json(
      { error: "Failed to fetch artist" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/artists/[id]
 * Update an artist
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { name, genre, era, description } = body;

    // Validation
    if (name !== undefined && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Artist name cannot be empty" },
        { status: 400 }
      );
    }

    // Update artist
    const artist = await artistRepo.update(id, {
      name: name?.trim(),
      genre: genre?.trim() || null,
      era: era?.trim() || null,
      description: description?.trim() || null,
    });

    return NextResponse.json({
      artist,
      message: "Artist updated successfully",
    });
  } catch (error) {
    console.error(`[API] Error updating artist:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update artist" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/artists/[id]
 * Delete an artist
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    
    // Check if artist has songs
    const artist = await artistRepo.findByIdWithSongs(id);
    if (artist && artist.songs && artist.songs.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete artist with ${artist.songs.length} song(s). Delete songs first.` },
        { status: 409 }
      );
    }

    await artistRepo.delete(id);

    return NextResponse.json({
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.error(`[API] Error deleting artist:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }
}
