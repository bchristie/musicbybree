"use client";

import { SongListProvider } from "./SongListProvider";
import { SearchBar } from "./SearchBar";
import { FilterAccordion } from "./FilterAccordion";
import { Pagination } from "./Pagination";
import { SongListTable } from "./SongListTable";
import { SongListMobile } from "./SongListMobile";
import { BulkActionsBar } from "./BulkActionsBar";
import type { SongWithRelations } from "./types";

export type { SongWithRelations };

interface AdminSongListProps {
  initialSongs: SongWithRelations[];
}

export function AdminSongList({ initialSongs }: AdminSongListProps) {
  return (
    <SongListProvider initialSongs={initialSongs}>
      <AdminSongListContent />
      <BulkActionsBar />
    </SongListProvider>
  );
}

function AdminSongListContent() {
  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchBar />

      {/* Filters */}
      <FilterAccordion />

      {/* Pagination - Top */}
      <Pagination />

      {/* Desktop view */}
      <div className="hidden md:block">
        <SongListTable />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <SongListMobile />
      </div>

      {/* Pagination - Bottom */}
      <Pagination />
    </div>
  );
}
