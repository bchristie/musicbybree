import Link from "next/link";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPerformances() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Performances
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Track your shows and setlists
          </p>
        </div>
        <Link
          href="/admin/performances/new"
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Add Performance
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No performances yet. Click "Add Performance" to get started.
        </p>
      </div>
    </div>
  );
}
