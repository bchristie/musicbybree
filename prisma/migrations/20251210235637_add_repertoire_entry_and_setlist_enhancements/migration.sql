-- CreateEnum
CREATE TYPE "RepertoireStatus" AS ENUM ('LEARNING', 'READY', 'FEATURED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Performance" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expectedDuration" INTEGER,
ADD COLUMN     "setlistNotes" TEXT,
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "RepertoireEntry" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "status" "RepertoireStatus" NOT NULL DEFAULT 'LEARNING',
    "performedKey" TEXT,
    "performedTempo" INTEGER,
    "capoPosition" INTEGER,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPracticed" TIMESTAMP(3),
    "lastPerformed" TIMESTAMP(3),
    "practiceCount" INTEGER NOT NULL DEFAULT 0,
    "performanceCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "arrangement" TEXT,
    "difficulty" INTEGER DEFAULT 3,
    "vocallyDemanding" BOOLEAN NOT NULL DEFAULT false,
    "energyLevel" INTEGER DEFAULT 3,
    "typicalDuration" INTEGER,
    "worksWellFor" TEXT,
    "avoidAfter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepertoireEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepertoireEntry_songId_key" ON "RepertoireEntry"("songId");

-- CreateIndex
CREATE INDEX "RepertoireEntry_status_idx" ON "RepertoireEntry"("status");

-- CreateIndex
CREATE INDEX "RepertoireEntry_lastPerformed_idx" ON "RepertoireEntry"("lastPerformed");

-- CreateIndex
CREATE INDEX "RepertoireEntry_lastPracticed_idx" ON "RepertoireEntry"("lastPracticed");

-- CreateIndex
CREATE INDEX "Performance_completed_idx" ON "Performance"("completed");

-- AddForeignKey
ALTER TABLE "RepertoireEntry" ADD CONSTRAINT "RepertoireEntry_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
