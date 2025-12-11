import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { songRepo } from "@/lib/repo/songRepo";
import { tagRepo } from "@/lib/repo/tagRepo";
import { artistRepo } from "@/lib/repo/artistRepo";
import { enrichSongMetadata } from "@/lib/openai";

// Generate a random color for tags
function generateRandomColor(): string {
  const colors = [
    '#1E40AF', // blue
    '#7C3AED', // purple
    '#059669', // green
    '#D97706', // amber
    '#DC2626', // red
    '#EC4899', // pink
    '#0891B2', // cyan
    '#65A30D', // lime
    '#C026D3', // fuchsia
    '#EA580C', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * POST /api/admin/songs/quick-add
 * Quickly add a song with auto-filled details from OpenAI
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { artistId, title } = await request.json();

    if (!artistId || !title) {
      return NextResponse.json(
        { error: "Artist ID and title are required" },
        { status: 400 }
      );
    }

    // Get artist for hint
    const artist = await artistRepo.findById(artistId);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Use OpenAI to enrich metadata for the song
    let enrichedData;
    try {
      enrichedData = await enrichSongMetadata({
        title,
        artist: artist.name,
        originalKey: undefined,
        tempo: undefined,
      });
    } catch (error) {
      console.error("Failed to enrich metadata:", error);
      return NextResponse.json(
        { error: "Failed to get song metadata" },
        { status: 500 }
      );
    }

    // Prepare tag IDs and genres/moods to add
    const tagIds: string[] = [];
    const genresToAdd = (enrichedData.suggestedGenres || []).slice(0, 2);

    // Handle genre tags (use first 2 genres if multiple)
    for (const genre of genresToAdd) {
      const existingGenre = await tagRepo.findByName(genre);
      if (existingGenre) {
        tagIds.push(existingGenre.id);
      } else {
        const newGenre = await tagRepo.create({
          name: genre,
          category: 'genre',
          color: generateRandomColor(),
        });
        tagIds.push(newGenre.id);
      }
    }

    // Handle mood tags (use first 2 moods if multiple)
    const moodsToAdd = (enrichedData.suggestedMoods || []).slice(0, 2);
    for (const mood of moodsToAdd) {
      const existingMood = await tagRepo.findByName(mood);
      if (existingMood) {
        tagIds.push(existingMood.id);
      } else {
        const newMood = await tagRepo.create({
          name: mood,
          category: 'mood',
          color: generateRandomColor(),
        });
        tagIds.push(newMood.id);
      }
    }

    // Create the song with enriched data
    const song = await songRepo.createWithTags({
      title,
      artist: { connect: { id: artistId } },
      originalKey: enrichedData.keySignature || null,
      tempo: enrichedData.estimatedTempo || null,
      duration: null,
      notes: null,
    }, tagIds);

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error quick-adding song:", error);
    return NextResponse.json(
      { error: "Failed to add song" },
      { status: 500 }
    );
  }
}
