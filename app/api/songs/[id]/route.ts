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
 * GET /api/songs/[id] - Get a specific song
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const song = await songRepo.findById(id);

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/songs/[id] - Update a song
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
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

    // Update the song
    await songRepo.update(id, {
      title,
      artist: { connect: { id: artistId } },
      originalKey: originalKey || null,
      tempo: tempo || null,
      duration: duration || null,
      notes: notes || null,
    });

    // Update tags
    await songRepo.updateTags(id, tagIds);

    // Fetch updated song with relations
    const song = await songRepo.findById(id);

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/songs/[id] - Delete a song
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await songRepo.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
