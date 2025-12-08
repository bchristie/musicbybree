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

  return <PublicSongList songs={songs} />;
}
