import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminArtists() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Artists
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Manage artist profiles and information
          </p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          Add Artist
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
        <p className="text-zinc-600 dark:text-zinc-400 text-center">
          No artists yet. Click "Add Artist" to get started.
        </p>
      </div>
    </div>
  );
}
