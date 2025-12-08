import Link from "next/link";

export default function PerformancesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Music by Bree
          </Link>
          <div className="flex gap-6">
            <Link
              href="/repertoire"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Repertoire
            </Link>
            <Link
              href="/performances"
              className="text-zinc-900 dark:text-zinc-50 font-medium"
            >
              Performances
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Past Performances
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              View my performance history
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              No performances yet. Check back soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
