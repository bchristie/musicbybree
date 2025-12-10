import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { artistRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/admin/artists
 * List all artists
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering/pagination
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");

    // Fetch artists (you can extend this with filtering)
    const artists = await artistRepo.findAll();

    // Optional: Apply filters
    let filtered = artists;
    if (search) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genre) {
      filtered = filtered.filter(a => a.genre === genre);
    }

    return NextResponse.json({
      artists: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("[API] Error fetching artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/artists
 * Create a new artist
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, genre, era, description } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    // Create artist (slug is auto-generated in repo)
    const artist = await artistRepo.create({
      name: name.trim(),
      genre: genre?.trim() || null,
      era: era?.trim() || null,
      description: description?.trim() || null,
    });

    return NextResponse.json(
      { artist, message: "Artist created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating artist:", error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An artist with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create artist" },
      { status: 500 }
    );
  }
}
