import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { tagRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/admin/tags
 * List all tags
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    // Fetch tags
    const tags = await tagRepo.findAll();

    // Optional: Filter by category
    let filtered = tags;
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }

    return NextResponse.json({
      tags: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("[API] Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tags
 * Create a new tag
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, color } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Create tag (slug is auto-generated in repo)
    const tag = await tagRepo.create({
      name: name.trim(),
      category: category?.trim() || "general",
      color: color?.trim() || null,
    });

    return NextResponse.json(
      { tag, message: "Tag created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating tag:", error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
