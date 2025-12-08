-- CreateTable
CREATE TABLE "Lyric" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "hasTiming" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lyric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LyricLine" (
    "id" TEXT NOT NULL,
    "lyricId" TEXT NOT NULL,
    "time" DOUBLE PRECISION,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LyricLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lyric_songId_key" ON "Lyric"("songId");

-- CreateIndex
CREATE INDEX "Lyric_songId_idx" ON "Lyric"("songId");

-- CreateIndex
CREATE INDEX "LyricLine_lyricId_order_idx" ON "LyricLine"("lyricId", "order");

-- AddForeignKey
ALTER TABLE "Lyric" ADD CONSTRAINT "Lyric_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LyricLine" ADD CONSTRAINT "LyricLine_lyricId_fkey" FOREIGN KEY ("lyricId") REFERENCES "Lyric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
