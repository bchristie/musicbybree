"use client";

import { formatDistanceToNow } from "date-fns";
import { Calendar, Music, TrendingUp } from "lucide-react";
import type { RepertoireEntryData } from "./types";

interface RepertoireStatsProps {
  repertoire: RepertoireEntryData;
}

export function RepertoireStats({ repertoire }: RepertoireStatsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Practice Stats */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Music className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Practice Sessions
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {repertoire.practiceCount}
            </p>
            {repertoire.lastPracticed && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Last: {formatDistanceToNow(new Date(repertoire.lastPracticed), { addSuffix: true })}
              </p>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Performances
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {repertoire.performanceCount}
            </p>
            {repertoire.lastPerformed && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Last: {formatDistanceToNow(new Date(repertoire.lastPerformed), { addSuffix: true })}
              </p>
            )}
          </div>
        </div>

        {/* Added Date */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              In Repertoire
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Added {formatDistanceToNow(new Date(repertoire.addedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
