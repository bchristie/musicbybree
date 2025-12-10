import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRecommendations } from "@/lib/openai";
import { songRepo } from "@/lib/repo";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/songs/recommend
 * Use AI to get song recommendations based on current repertoire
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { count = 10, useCurrentRepertoire = true, customSongs = [] } = body;

    let repertoire: { title: string; artist: string; genre?: string }[] = [];

    if (useCurrentRepertoire) {
      // Fetch current repertoire from database
      const songs = await songRepo.findForRepertoire();
      repertoire = songs.map((song) => ({
        title: song.title,
        artist: song.artist.name,
        genre: song.tags.find((t) => t.tag.category === "genre")?.tag.name,
      }));
    } else if (customSongs && Array.isArray(customSongs)) {
      // Use custom song list provided by client
      repertoire = customSongs;
    }

    // Validation
    if (repertoire.length === 0) {
      return NextResponse.json(
        { error: "No repertoire found. Add some songs first." },
        { status: 400 }
      );
    }

    // Call OpenAI to get recommendations
    const recommendations = await getRecommendations(repertoire, count);

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
      basedOn: repertoire.length,
      message: `Generated ${recommendations.length} recommendation(s)`,
    });
  } catch (error) {
    console.error("[API] Error getting recommendations:", error);
    
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
      { error: "Failed to get song recommendations" },
      { status: 500 }
    );
  }
}
