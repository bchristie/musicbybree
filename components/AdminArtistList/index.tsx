"use client";

import { ArtistListProvider } from "./ArtistListProvider";
import { SearchBar } from "./SearchBar";
import { FilterAccordion } from "./FilterAccordion";
import { ArtistListDesktop } from "./ArtistListDesktop";
import { ArtistListMobile } from "./ArtistListMobile";
import type { ArtistWithSongCount } from "./types";

export type { ArtistWithSongCount };

interface AdminArtistListProps {
  initialArtists: ArtistWithSongCount[];
}

export function AdminArtistList({ initialArtists }: AdminArtistListProps) {
  return (
    <ArtistListProvider initialArtists={initialArtists}>
      <AdminArtistListContent />
    </ArtistListProvider>
  );
}

function AdminArtistListContent() {
  return (
    <div className="space-y-4">
      {/* Header with search */}
      <SearchBar />

      {/* Filters */}
      <FilterAccordion />

      {/* Desktop view */}
      <div className="hidden md:block">
        <ArtistListDesktop />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <ArtistListMobile />
      </div>
    </div>
  );
}
