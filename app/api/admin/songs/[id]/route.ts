import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { songRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ id: string }>;

/**
 * GET /api/admin/songs/[id]
 * Get a single song by ID
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
    const song = await songRepo.findById(id);

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ song });
  } catch (error) {
    console.error(`[API] Error fetching song:`, error);
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/songs/[id]
 * Update a song
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
    const { title, originalKey, tempo, duration, notes, tagIds } = body;

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return NextResponse.json(
        { error: "Song title cannot be empty" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (originalKey !== undefined) updateData.originalKey = originalKey?.trim() || null;
    if (tempo !== undefined) updateData.tempo = tempo ? parseInt(tempo) : null;
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    
    // TODO: Add tag updates when needed
    // if (tagIds !== undefined && Array.isArray(tagIds)) {
    //   updateData.tags = { set: tagIds.map(id => ({ songId_tagId: { songId: id, tagId: id } })) };
    // }

    // Update song
    const song = await songRepo.update(id, updateData);

    // Fetch updated song with relations
    const fullSong = await songRepo.findById(id);

    return NextResponse.json({
      song: fullSong,
      message: "Song updated successfully",
    });
  } catch (error) {
    console.error(`[API] Error updating song:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/songs/[id]
 * Delete a song
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
    await songRepo.delete(id);

    return NextResponse.json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error(`[API] Error deleting song:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
