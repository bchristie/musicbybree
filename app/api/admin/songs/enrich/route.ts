import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { enrichSongMetadata } from "@/lib/openai";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/songs/enrich
 * Use AI to enrich song metadata with suggestions
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, artist, originalKey, tempo } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Song title is required" },
        { status: 400 }
      );
    }

    if (!artist || typeof artist !== "string" || artist.trim().length === 0) {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    // Call OpenAI to enrich song metadata
    const enrichedData = await enrichSongMetadata({
      title: title.trim(),
      artist: artist.trim(),
      originalKey: originalKey?.trim(),
      tempo: tempo ? parseInt(tempo) : undefined,
    });

    return NextResponse.json({
      enrichment: enrichedData,
      message: "Song metadata enriched successfully",
    });
  } catch (error) {
    console.error("[API] Error enriching song:", error);
    
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
      { error: "Failed to enrich song metadata" },
      { status: 500 }
    );
  }
}
