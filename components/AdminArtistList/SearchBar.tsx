"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useEffect } from "react";
import type { ArtistFilters } from "@/hooks/useAdminArtistFilters";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
}

export function SearchBar({ value, onChange, isPending }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input with debouncing handled by parent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search artists..."
        value={value}
        onChange={handleChange}
        className="pl-9 pr-4"
        disabled={isPending}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        </div>
      )}
    </div>
  );
}
