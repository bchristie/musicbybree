import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { tagRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ id: string }>;

/**
 * GET /api/admin/tags/[id]
 * Get a single tag by ID
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
    const tag = await tagRepo.findById(id);

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tag });
  } catch (error) {
    console.error(`[API] Error fetching tag:`, error);
    return NextResponse.json(
      { error: "Failed to fetch tag" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/tags/[id]
 * Update a tag
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
    const { name, category, color } = body;

    // Validation
    if (name !== undefined && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Tag name cannot be empty" },
        { status: 400 }
      );
    }

    // Update tag
    const tag = await tagRepo.update(id, {
      name: name?.trim(),
      category: category?.trim(),
      color: color?.trim() || null,
    });

    return NextResponse.json({
      tag,
      message: "Tag updated successfully",
    });
  } catch (error) {
    console.error(`[API] Error updating tag:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tags/[id]
 * Delete a tag
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
    await tagRepo.delete(id);

    return NextResponse.json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error(`[API] Error deleting tag:`, error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
