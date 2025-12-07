import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Manage your vocal portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/songs"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Songs
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your repertoire
          </p>
        </Link>

        <Link
          href="/admin/performances"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Performances
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track your shows
          </p>
        </Link>

        <Link
          href="/admin/tags"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Tags
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Organize by genre & facets
          </p>
        </Link>
      </div>
    </div>
  );
}
