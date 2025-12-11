import { Suspense } from "react";
import { songRepo } from "@/lib/repo";
import { PublicSongList } from "@/components/PublicSongList";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export const metadata = {
  title: "Song Repertoire",
  description: "Browse through the complete collection of songs available for performance",
};

export default async function RepertoirePage() {
  const songs = await songRepo.findForRepertoire();

  return (
    <Suspense fallback={<RepertoireLoading />}>
      <PublicSongList songs={songs} />
    </Suspense>
  );
}

function RepertoireLoading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
