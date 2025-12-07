import Link from "next/link";

export default function AdminTagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Tags
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Organize songs by genre, holiday, and more
          </p>
        </div>
        <button
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Add Tag
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Genres
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No genre tags yet
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Holidays
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No holiday tags yet
          </p>
        </div>
      </div>
    </div>
  );
}
