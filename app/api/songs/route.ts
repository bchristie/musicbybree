import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { songRepo } from "@/lib/repo/songRepo";
import { tagRepo } from "@/lib/repo/tagRepo";

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
 * GET /api/songs - List all songs
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const songs = await songRepo.findAll();
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/songs - Create a new song
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, artistId, originalKey, tempo, duration, notes, tags, genre, mood } = body;

    if (!title || !artistId) {
      return NextResponse.json(
        { error: "Title and artist are required" },
        { status: 400 }
      );
    }

    // Handle genre and mood tags - create if they don't exist
    const tagIds = [...(tags || [])];
    
    if (genre) {
      const existingGenre = await tagRepo.findByName(genre);
      if (existingGenre) {
        if (!tagIds.includes(existingGenre.id)) {
          tagIds.push(existingGenre.id);
        }
      } else {
        // Create new genre tag
        const newGenre = await tagRepo.create({
          name: genre,
          category: 'genre',
          color: generateRandomColor(),
        });
        tagIds.push(newGenre.id);
      }
    }
    
    if (mood) {
      const existingMood = await tagRepo.findByName(mood);
      if (existingMood) {
        if (!tagIds.includes(existingMood.id)) {
          tagIds.push(existingMood.id);
        }
      } else {
        // Create new mood tag
        const newMood = await tagRepo.create({
          name: mood,
          category: 'mood',
          color: generateRandomColor(),
        });
        tagIds.push(newMood.id);
      }
    }

    const song = await songRepo.createWithTags({
      title,
      artist: { connect: { id: artistId } },
      originalKey: originalKey || null,
      tempo: tempo || null,
      duration: duration || null,
      notes: notes || null,
    }, tagIds);

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
