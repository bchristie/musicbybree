import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { artistRepo } from "@/lib/repo/artistRepo";
import { songRepo } from "@/lib/repo/songRepo";
import { getSuggestedSongs } from "@/lib/openai";

/**
 * POST /api/admin/artists/:id/suggest-songs
 * Get AI-powered song suggestions for an artist
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: artistId } = await params;

  try {
    // Get artist and their existing songs
    const [artist, songs] = await Promise.all([
      artistRepo.findById(artistId),
      songRepo.findByArtistId(artistId),
    ]);

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Get existing song titles for deduplication
    const existingTitles = songs.map((song) => song.title);

    // Call OpenAI to get suggestions
    const suggestions = await getSuggestedSongs(artist.name, existingTitles);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error getting song suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
