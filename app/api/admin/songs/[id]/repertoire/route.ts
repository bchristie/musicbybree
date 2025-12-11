import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { RepertoireStatus } from "@prisma/client";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: songId } = await context.params;
    const body = await request.json();

    // Check if song exists
    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check if already in repertoire
    const existing = await prisma.repertoireEntry.findUnique({
      where: { songId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Song already in repertoire" },
        { status: 400 }
      );
    }

    // Create repertoire entry
    const repertoireEntry = await prisma.repertoireEntry.create({
      data: {
        songId,
        status: (body.status as RepertoireStatus) || "LEARNING",
        performedKey: body.performedKey || null,
        performedTempo: body.performedTempo || null,
        capoPosition: body.capoPosition || null,
        typicalDuration: body.typicalDuration || null,
        difficulty: body.difficulty || null,
        vocallyDemanding: body.vocallyDemanding || false,
        energyLevel: body.energyLevel || null,
        worksWellFor: body.worksWellFor || null,
        avoidAfter: body.avoidAfter || null,
        notes: body.notes || null,
        arrangement: body.arrangement || null,
      },
    });

    return NextResponse.json(repertoireEntry);
  } catch (error) {
    console.error("Error adding to repertoire:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: songId } = await context.params;
    const body = await request.json();

    // Check if in repertoire
    const existing = await prisma.repertoireEntry.findUnique({
      where: { songId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Song not in repertoire" },
        { status: 404 }
      );
    }

    // Handle special "logPractice" action
    if (body.logPractice) {
      const updated = await prisma.repertoireEntry.update({
        where: { songId },
        data: {
          lastPracticed: new Date(),
          practiceCount: { increment: 1 },
        },
      });
      return NextResponse.json(updated);
    }

    // Update repertoire entry
    const updateData: any = {};
    
    if (body.status !== undefined) updateData.status = body.status;
    if (body.performedKey !== undefined) updateData.performedKey = body.performedKey || null;
    if (body.performedTempo !== undefined) updateData.performedTempo = body.performedTempo;
    if (body.capoPosition !== undefined) updateData.capoPosition = body.capoPosition;
    if (body.typicalDuration !== undefined) updateData.typicalDuration = body.typicalDuration;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.vocallyDemanding !== undefined) updateData.vocallyDemanding = body.vocallyDemanding;
    if (body.energyLevel !== undefined) updateData.energyLevel = body.energyLevel;
    if (body.worksWellFor !== undefined) updateData.worksWellFor = body.worksWellFor || null;
    if (body.avoidAfter !== undefined) updateData.avoidAfter = body.avoidAfter || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.arrangement !== undefined) updateData.arrangement = body.arrangement || null;

    const repertoireEntry = await prisma.repertoireEntry.update({
      where: { songId },
      data: updateData,
    });

    return NextResponse.json(repertoireEntry);
  } catch (error) {
    console.error("Error updating repertoire:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: songId } = await context.params;

    // Check if in repertoire
    const existing = await prisma.repertoireEntry.findUnique({
      where: { songId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Song not in repertoire" },
        { status: 404 }
      );
    }

    // Delete repertoire entry
    await prisma.repertoireEntry.delete({
      where: { songId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from repertoire:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
