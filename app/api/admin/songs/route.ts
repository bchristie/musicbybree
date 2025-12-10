import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { songRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/admin/songs
 * List all songs with filters
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
    const search = searchParams.get("search");
    const artistId = searchParams.get("artistId");
    const tagId = searchParams.get("tagId");

    // Fetch songs with full relations
    const songs = await songRepo.findForRepertoire();

    // Apply filters
    let filtered = songs;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.name.toLowerCase().includes(searchLower)
      );
    }

    if (artistId) {
      filtered = filtered.filter(song => song.artistId === artistId);
    }

    if (tagId) {
      filtered = filtered.filter(song =>
        song.tags.some(t => t.tag.id === tagId)
      );
    }

    return NextResponse.json({
      songs: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("[API] Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/songs
 * Create a new song
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, artistId, originalKey, tempo, duration, notes, tagIds } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Song title is required" },
        { status: 400 }
      );
    }

    if (!artistId || typeof artistId !== "string") {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 }
      );
    }

    // Create song with tags (using Prisma relation format)
    const songData = {
      title: title.trim(),
      artist: { connect: { id: artistId } },
      originalKey: originalKey?.trim() || null,
      tempo: tempo ? parseInt(tempo) : null,
      duration: duration ? parseInt(duration) : null,
      notes: notes?.trim() || null,
    };

    const song = tagIds && Array.isArray(tagIds) && tagIds.length > 0
      ? await songRepo.createWithTags(songData, tagIds)
      : await songRepo.create(songData);

    // Fetch full song with relations
    const fullSong = await songRepo.findById(song.id);

    return NextResponse.json(
      { song: fullSong, message: "Song created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error creating song:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Artist not found" },
          { status: 404 }
        );
      }
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A song with this title already exists for this artist" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
