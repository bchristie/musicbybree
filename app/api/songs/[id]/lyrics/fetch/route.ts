import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LyricsService } from "@/lib/lyrics";

// POST /api/songs/:id/lyrics/fetch - Fetch lyrics from AZLyrics
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: songId } = await params;

  try {
    // Get song details
    const song = await prisma.song.findUnique({
      where: { id: songId },
      include: {
        artist: true,
      },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Fetch lyrics using AZLyrics provider
    const lyricsService = new LyricsService();
    const result = await lyricsService.getLyrics(
      song.artist.name,
      song.title
    );

    if (!result) {
      return NextResponse.json(
        { error: "Lyrics not found" },
        { status: 404 }
      );
    }

    // Check if lyrics already exist
    const existingLyrics = await prisma.lyric.findUnique({
      where: { songId },
    });

    let lyrics;
    if (existingLyrics) {
      // Update existing lyrics
      await prisma.lyricLine.deleteMany({
        where: { lyricId: existingLyrics.id },
      });

      lyrics = await prisma.lyric.update({
        where: { songId },
        data: {
          hasTiming: result.hasTiming,
          source: result.source,
          lines: {
            create: result.lines.map((line, index) => ({
              text: line.text,
              time: line.time,
              order: index + 1,
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
    } else {
      // Create new lyrics
      lyrics = await prisma.lyric.create({
        data: {
          songId,
          hasTiming: result.hasTiming,
          source: result.source,
          lines: {
            create: result.lines.map((line, index) => ({
              text: line.text,
              time: line.time,
              order: index + 1,
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
    }

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
