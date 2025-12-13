import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminSongList } from "@/components/AdminSongList";
import { songRepo } from "@/lib/repo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getSongsWithRelations() {
  return songRepo.findAll({
    includeArtist: true,
    includeTags: true,
    includeRepertoireEntry: true,
    includeLyrics: true,
  });
}

export default async function AdminSongsPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const songs = await getSongsWithRelations();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Songs
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Manage your repertoire and song catalog
          </p>
        </div>
        <Link href="/admin/songs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Song
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              Loading songs...
            </p>
          </div>
        }
      >
        <AdminSongList initialSongs={songs as any} />
      </Suspense>
    </div>
  );
}
