import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminSongDetail } from "@/components/AdminSongDetail";
import { songRepo } from "@/lib/repo/songRepo";
import { artistRepo } from "@/lib/repo/artistRepo";
import { tagRepo } from "@/lib/repo/tagRepo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string; songId: string }>;
}

export default async function EditSongPage({ params }: PageProps) {
  const { id: artistId, songId } = await params;

  const [song, artist, allTags, allArtists] = await Promise.all([
    songRepo.findById(songId),
    artistRepo.findById(artistId),
    tagRepo.findAll(),
    artistRepo.findAll(),
  ]);

  if (!song || !artist) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href={`/admin/artists/${artistId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {artist.name}
          </Button>
        </Link>
      </div>

      <AdminSongDetail
        song={song}
        artistId={artistId}
        artistName={artist.name}
        tags={allTags}
        artists={allArtists}
      />
    </div>
  );
}
