import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { artistRepo } from "@/lib/repo/artistRepo";
import { songRepo } from "@/lib/repo/songRepo";
import { AdminArtistDetail } from "@/components/AdminArtistDetail";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArtistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  
  // Fetch artist with song count
  const artist = await artistRepo.findById(id);
  
  if (!artist) {
    notFound();
  }

  // Fetch songs by this artist with repertoire status and lyrics
  const allSongs = await songRepo.findAll({
    includeArtist: false,
    includeTags: false,
    includePerformanceCount: false,
    includeRepertoireEntry: true,
    includeLyrics: true,
  });
  
  const artistSongs = allSongs
    .filter(song => song.artistId === id)
    .map(song => ({
      id: song.id,
      title: song.title,
      originalKey: song.originalKey,
      tempo: song.tempo,
      duration: song.duration,
      hasLyrics: !!song.lyric,
      repertoireEntry: song.repertoireEntry ? {
        status: song.repertoireEntry.status,
      } : null,
    }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/artists">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artists
          </Button>
        </Link>
      </div>

      <AdminArtistDetail
        artist={{
          ...artist,
          _count: { songs: artistSongs.length },
        }}
        songs={artistSongs}
      />
    </div>
  );
}
