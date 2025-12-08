import { notFound } from "next/navigation";
import Link from "next/link";
import { songRepo } from "@/lib/repo";
import { Music, Clock, User } from "lucide-react";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// Generate static params for all songs at build time
export async function generateStaticParams() {
  const songs = await songRepo.findAll();
  
  return songs.map((song) => ({
    id: song.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await songRepo.findById(id);

  if (!song) {
    return {
      title: "Song Not Found",
    };
  }

  return {
    title: `${song.title} by ${song.artist.name}`,
    description: song.notes || `${song.title} - A song by ${song.artist.name}`,
  };
}

interface SongDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { id } = await params;
  const song = await songRepo.findById(id);

  if (!song) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/repertoire"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-8 transition-colors"
      >
        ← Back to Repertoire
      </Link>

      {/* Song Header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50">
          {song.title}
        </h1>
        <div className="flex items-center gap-4 text-lg text-zinc-600 dark:text-zinc-400">
          <Link
            href={`/repertoire?artists=${song.artistId}`}
            className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <User className="w-5 h-5" />
            {song.artist.name}
          </Link>
        </div>
      </div>

      {/* Song Details Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Song Details
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {song.originalKey && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-500">Key</dt>
              <dd className="mt-1 text-lg text-zinc-900 dark:text-zinc-50">{song.originalKey}</dd>
            </div>
          )}

          {song.tempo && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-500">Tempo</dt>
              <dd className="mt-1 text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Music className="w-4 h-4" />
                {song.tempo} BPM
              </dd>
            </div>
          )}

          {song.duration && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-500">Duration</dt>
              <dd className="mt-1 text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
              </dd>
            </div>
          )}

          {song.artist.genre && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-500">Genre</dt>
              <dd className="mt-1 text-lg text-zinc-900 dark:text-zinc-50">{song.artist.genre}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Tags */}
      {song.tags.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {song.tags.map((st) => (
              <Link
                key={st.tag.id}
                href={`/repertoire?tags=${st.tag.id}`}
                className="px-3 py-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                style={
                  st.tag.color
                    ? {
                        backgroundColor: `${st.tag.color}20`,
                        color: st.tag.color,
                      }
                    : undefined
                }
              >
                {st.tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {song.notes && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Notes</h2>
          <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{song.notes}</p>
        </div>
      )}

      {/* Performances */}
      {song.performances && song.performances.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Past Performances
          </h2>
          <div className="space-y-3">
            {song.performances.map((ps) => (
              <Link
                key={ps.performance.id}
                href={`/performances#${ps.performance.id}`}
                className="block p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded transition-colors"
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {ps.performance.venue}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(ps.performance.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
