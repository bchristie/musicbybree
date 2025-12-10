"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useArtistList } from "./ArtistListProvider";

export function ArtistListMobile() {
  const router = useRouter();
  const { filteredArtists } = useArtistList();

  const handleSelect = (artistId: string) => {
    router.push(`/admin/artists/${artistId}`);
  };

  if (filteredArtists.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500 text-sm">No artists found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredArtists.map((artist) => (
        <Card
          key={artist.id}
          onClick={() => handleSelect(artist.id)}
          className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100 truncate">
                {artist.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {artist.genre && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {artist.genre}
                  </span>
                )}
                {artist.era && (
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {artist.era}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 text-xs font-medium bg-zinc-100 text-zinc-700 rounded dark:bg-zinc-800 dark:text-zinc-300">
                {artist._count.songs}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
