import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { findArtist } from "@/lib/openai";

// Force dynamic rendering - never cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/admin/artists/find
 * Use AI to find information about an artist
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    // Call OpenAI to find artist information
    const artistInfo = await findArtist(name.trim());

    return NextResponse.json({
      artist: artistInfo,
      message: "Artist information retrieved successfully",
    });
  } catch (error) {
    console.error("[API] Error finding artist:", error);
    
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
      { error: "Failed to find artist information" },
      { status: 500 }
    );
  }
}
