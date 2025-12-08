import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Welcome to My Repertoire
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Explore my collection of vocal performances, from classic standards to contemporary hits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/repertoire"
              className="px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors w-full sm:w-auto text-center"
            >
              Browse Repertoire
            </Link>
            <Link
              href="/performances"
              className="px-8 py-3 border-2 border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors w-full sm:w-auto text-center"
            >
              Past Performances
            </Link>
          </div>
        </div>
      </main>
  );
}
