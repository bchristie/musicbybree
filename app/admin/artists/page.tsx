import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminArtistList } from "@/components/AdminArtistList";
import { artistRepo } from "@/lib/repo";
import { Button } from "@/components/ui/button";

async function getArtistsWithSongCount() {
  const artists = await artistRepo.findAll();
  
  // Fetch song counts for each artist
  const artistsWithCounts = await Promise.all(
    artists.map(async (artist) => {
      const withSongs = await artistRepo.findByIdWithSongs(artist.id);
      return {
        ...artist,
        _count: {
          songs: withSongs?.songs.length ?? 0,
        },
      };
    })
  );

  return artistsWithCounts;
}

export default async function AdminArtistsPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const artists = await getArtistsWithSongCount();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Artists
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Manage artist profiles and information
          </p>
        </div>
        <Button>Add Artist</Button>
      </div>

      <Suspense
        fallback={
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              Loading artists...
            </p>
          </div>
        }
      >
        <AdminArtistList initialArtists={artists} />
      </Suspense>
    </div>
  );
}

