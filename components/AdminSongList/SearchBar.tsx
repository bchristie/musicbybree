"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSongList } from "./SongListProvider";

export function SearchBar() {
  const { filters, setSearch } = useSongList();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
      <Input
        type="text"
        placeholder="Search songs or artists..."
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
