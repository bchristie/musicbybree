export default function PerformancesPage() {
  return (
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
  );
}
