import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Vocal Portfolio
          </h1>
          <div className="flex gap-6">
            <Link
              href="/repertoire"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Repertoire
            </Link>
            <Link
              href="/performances"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Performances
            </Link>
          </div>
        </nav>
      </header>

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
    </div>
  );
}
