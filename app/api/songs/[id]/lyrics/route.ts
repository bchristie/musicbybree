import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { LyricsData } from "@/components/AdminSongDetail/LyricsEditor/types";

// GET /api/songs/:id/lyrics - Get lyrics for a song
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: songId } = await params;

  try {
    const lyrics = await prisma.lyric.findUnique({
      where: { songId },
      include: {
        lines: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lyrics) {
      return NextResponse.json(null);
    }

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}

// POST /api/songs/:id/lyrics - Create lyrics
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: songId } = await params;
  const data: LyricsData = await request.json();

  try {
    const lyrics = await prisma.lyric.create({
      data: {
        songId,
        hasTiming: data.hasTiming,
        source: data.source,
        lines: {
          create: data.lines.map((line) => ({
            text: line.text,
            time: line.time,
            order: line.order,
            breakAfter: line.breakAfter || false,
          })),
        },
      },
      include: {
        lines: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error creating lyrics:", error);
    return NextResponse.json(
      { error: "Failed to create lyrics" },
      { status: 500 }
    );
  }
}

// PUT /api/songs/:id/lyrics - Update lyrics
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: songId } = await params;
  const data: LyricsData = await request.json();

  try {
    // Delete existing lines
    await prisma.lyricLine.deleteMany({
      where: {
        lyric: { songId },
      },
    });

    // Update lyrics with new lines
    const lyrics = await prisma.lyric.update({
      where: { songId },
      data: {
        hasTiming: data.hasTiming,
        source: data.source,
        lines: {
          create: data.lines.map((line) => ({
            text: line.text,
            time: line.time,
            order: line.order,
            breakAfter: line.breakAfter || false,
          })),
        },
      },
      include: {
        lines: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error updating lyrics:", error);
    return NextResponse.json(
      { error: "Failed to update lyrics" },
      { status: 500 }
    );
  }
}

// DELETE /api/songs/:id/lyrics - Delete lyrics
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: songId } = await params;

  try {
    await prisma.lyric.delete({
      where: { songId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lyrics:", error);
    return NextResponse.json(
      { error: "Failed to delete lyrics" },
      { status: 500 }
    );
  }
}
