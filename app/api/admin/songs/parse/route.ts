import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseSongInput } from "@/lib/openai";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/songs/parse
 * Use AI to parse natural language input into structured song data
 * Useful for bulk imports or quick entry
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { input } = body;

    // Validation
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input text is required" },
        { status: 400 }
      );
    }

    // Call OpenAI to parse the input
    const songs = await parseSongInput(input.trim());

    return NextResponse.json({
      songs,
      count: songs.length,
      message: `Parsed ${songs.length} song(s) from input`,
    });
  } catch (error) {
    console.error("[API] Error parsing song input:", error);
    
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
      { error: "Failed to parse song input" },
      { status: 500 }
    );
  }
}
