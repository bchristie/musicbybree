import { songRepo } from "@/lib/repo";
import { PublicSongList } from "@/components/PublicSongList";

export default async function RepertoirePage() {
  const songs = await songRepo.findForRepertoire();

  return <PublicSongList songs={songs} />;
}
