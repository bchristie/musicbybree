import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    // Return the children without the admin layout
    // This allows the login page to render
    // Admin pages will handle their own redirects
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
            >
              Admin Panel
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/admin/dashboard"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/songs"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Songs
              </Link>
              <Link
                href="/admin/performances"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Performances
              </Link>
              <Link
                href="/admin/tags"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Tags
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              View Site
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
