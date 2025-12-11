# Repertoire System - Implementation Summary

## ✅ What Was Built

### 1. Database Schema (Prisma)

**New Enum:**
- `RepertoireStatus` - LEARNING, READY, FEATURED, ARCHIVED

**New Model: `RepertoireEntry`**
- One-to-one with Song (a song can have at most one active repertoire entry)
- **Performance metadata**: `performedKey`, `performedTempo`, `capoPosition`
- **Tracking**: `addedAt`, `lastPracticed`, `lastPerformed`, `practiceCount`, `performanceCount`
- **Notes**: `notes` (free-form), `arrangement` (song structure)
- **Setlist helpers**: `difficulty`, `vocallyDemanding`, `energyLevel`, `typicalDuration`, `worksWellFor`, `avoidAfter`

**Enhanced Model: `Performance`**
- Added: `type`, `expectedDuration`, `completed`, `setlistNotes`
- Better tracking for gig management

### 2. Updated songRepo

`findForRepertoire()` now:
- Filters to only `READY` or `FEATURED` songs
- Includes `repertoireEntry` with performance metadata
- Public site only shows performance-ready songs

### 3. Utility Files

**`lib/repertoire.ts`** - Helper functions:
- `isInRepertoire()` - Check if song has repertoire entry
- `isPerformanceReady()` - Check if song is READY/FEATURED
- `getDisplayKey()`, `getDisplayTempo()`, `getDisplayDuration()` - Get performed values with fallback to original
- `getStatusColor()`, `getStatusLabel()` - UI helpers for status badges

**`scripts/add-to-repertoire.ts`** - Migration script:
- Adds existing songs to repertoire with READY status
- Copies original key/tempo to performed values
- Run with: `npx tsx scripts/add-to-repertoire.ts`

**`REPERTOIRE.md`** - Complete documentation:
- System overview
- Common operations (add, update, remove)
- Query examples
- Best practices

### 4. Migration Applied

Migration: `20251210235637_add_repertoire_entry_and_setlist_enhancements`
- Created `RepertoireStatus` enum
- Created `RepertoireEntry` table
- Updated `Performance` table
- Added indexes for performance

## 🎯 How It Works

### The Flow

```
1. Add Song to Database
   ↓
2. Add to Repertoire (status: LEARNING)
   ↓
3. Practice & Track Progress
   - Update lastPracticed
   - Increment practiceCount
   - Add notes (capo, key changes, etc.)
   ↓
4. Promote to READY
   ↓
5. Create Performance/Setlist
   - Filter by READY/FEATURED
   - See your performance metadata
   ↓
6. Mark Performance Complete
   - Update lastPerformed
   - Increment performanceCount
   ↓
7. Optionally Promote to FEATURED
   (for your best songs)
```

### Public vs Admin

**Public Site:**
- Only shows songs with status `READY` or `FEATURED`
- Displays your `performedKey`, `performedTempo` (not original values)
- Hides learning/archived songs

**Admin:**
- See all songs regardless of status
- Filter by status (show me what I'm learning)
- Track practice/performance counts
- Manage notes, capo positions, arrangements

## 📊 Use Cases Enabled

### 1. Practice Management
```sql
-- Songs I haven't practiced in a week
WHERE repertoireEntry.status = 'LEARNING'
  AND repertoireEntry.lastPracticed < NOW() - INTERVAL '7 days'
```

### 2. Setlist Building
```sql
-- Performance-ready songs I haven't played in 30 days
WHERE repertoireEntry.status IN ('READY', 'FEATURED')
  AND (repertoireEntry.lastPerformed IS NULL 
       OR repertoireEntry.lastPerformed < NOW() - INTERVAL '30 days')
```

### 3. Performance Tracking
```sql
-- My 10 most-performed songs
WHERE repertoireEntry IS NOT NULL
ORDER BY repertoireEntry.performanceCount DESC
LIMIT 10
```

### 4. Smart Suggestions
```sql
-- Featured songs with high energy for an upbeat gig
WHERE repertoireEntry.status = 'FEATURED'
  AND repertoireEntry.energyLevel >= 4
```

## 🚀 Next Steps

### Immediate
1. Run migration script to add existing songs:
   ```bash
   npx tsx scripts/add-to-repertoire.ts
   ```

2. Customize song repertoire entries in admin:
   - Add notes (capo positions, vocal notes)
   - Set performed keys if different from original
   - Update status (LEARNING → READY → FEATURED)

### Admin UI Enhancements (Future)
- **Song Detail Page**: Add "Repertoire" section showing status, notes, practice/performance counts
- **Repertoire Tab**: New admin page filtering songs by repertoire status
- **Practice Log**: Quick-update `lastPracticed` and `practiceCount`
- **Setlist Builder**: Drag-and-drop interface with smart filtering
- **Performance Manager**: Mark gigs as complete, auto-update song counts

### Analytics (Future)
- Dashboard showing:
  - Total songs in repertoire by status
  - Songs needing practice
  - Most/least performed songs
  - Setlist statistics

## 📝 Key Design Decisions

1. **One-to-One Relationship** - A song either IS or ISN'T in your current repertoire (not historical tracking)
2. **Nullable Repertoire Entry** - Songs can exist without being in repertoire
3. **Performed vs Original** - Separate fields for YOUR version (key, tempo) vs canonical song data
4. **Status Enum** - Four states cover learning journey and lifecycle
5. **Public Filter** - Only READY/FEATURED shown to public, keeps learning songs private

## 🎼 Integration with Existing Features

- **Tags**: Still work independently (genre, mood, etc.)
- **Performances**: Enhanced with repertoire tracking
- **Lyrics**: Unchanged, works alongside repertoire
- **Artists**: Unchanged, songs still belong to artists

The repertoire system is a **layer on top** of your existing song database, not a replacement.
