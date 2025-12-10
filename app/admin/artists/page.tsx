import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminArtistList } from "@/components/AdminArtistList";
import { artistRepo } from "@/lib/repo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getArtistsWithSongCount() {
  return artistRepo.findAll({ includeSongCount: true });
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
        <Link href="/admin/artists/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Artist
          </Button>
        </Link>
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
        <AdminArtistList initialArtists={artists as any} />
      </Suspense>
    </div>
  );
}

