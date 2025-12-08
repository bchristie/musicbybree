"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Music by Bree
        </Link>
        <div className="flex gap-6">
          <Link
            href="/repertoire"
            className={
              pathname === "/repertoire"
                ? "text-zinc-900 dark:text-zinc-50 font-medium"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            }
          >
            Repertoire
          </Link>
          <Link
            href="/performances"
            className={
              pathname === "/performances"
                ? "text-zinc-900 dark:text-zinc-50 font-medium"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            }
          >
            Performances
          </Link>
        </div>
      </nav>
    </header>
  );
}
