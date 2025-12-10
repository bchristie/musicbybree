import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { findSong, enrichSongMetadata } from "@/lib/openai";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/songs/find
 * Use AI to find information about a song
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, artist } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Song title is required" },
        { status: 400 }
      );
    }

    // Call OpenAI to find song information
    const songInfo = await findSong(title.trim(), artist?.trim());

    return NextResponse.json({
      song: songInfo,
      message: "Song information retrieved successfully",
    });
  } catch (error) {
    console.error("[API] Error finding song:", error);
    
    // Handle OpenAI errors gracefully
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "OpenAI API key not configured" },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to find song information" },
      { status: 500 }
    );
  }
}
