# Repertoire System Guide

## Overview

The repertoire system separates "songs in your database" from "songs you actively perform". This allows you to:
- Track learning progress (LEARNING → READY → FEATURED)
- Store performance-specific metadata (your key, capo position, notes)
- Track practice and performance history
- Filter public repertoire to only show performance-ready songs

## Repertoire Status

Songs can have one of four statuses in your repertoire:

- **LEARNING** - Currently practicing, not performance-ready
- **READY** - Confident and performance-ready (shown on public site)
- **FEATURED** - Your best songs, highest confidence (shown on public site)
- **ARCHIVED** - Previously performed but not actively maintained

## Key Fields

### Performance Metadata (YOUR version)
- `performedKey` - The key you perform it in (may differ from `originalKey`)
- `performedTempo` - Your performance tempo (may differ from original `tempo`)
- `capoPosition` - Guitar capo position
- `typicalDuration` - How long YOUR version takes

### Tracking
- `addedAt` - When added to repertoire
- `lastPracticed` - Last practice session
- `lastPerformed` - Last live performance
- `practiceCount` - Total practice sessions
- `performanceCount` - Total live performances

### Notes & Customization
- `notes` - Free-form: "Capo 3, fingerstyle intro, vocal harmony on chorus"
- `arrangement` - Structure: "Verse-Chorus-Bridge-Chorus x2"

### Setlist Planning
- `difficulty` - 1-5 scale
- `vocallyDemanding` - Boolean flag
- `energyLevel` - 1-5 (ballad to uptempo)
- `worksWellFor` - "weddings, corporate, jazz clubs"
- `avoidAfter` - "Don't follow with another ballad"

## Common Operations

### Add a song to repertoire

```typescript
await prisma.repertoireEntry.create({
  data: {
    songId: "song-id",
    status: "LEARNING",
    performedKey: "G",
    capoPosition: 3,
    notes: "Fingerpicked intro, strum on chorus"
  }
});
```

### Update after practice

```typescript
await prisma.repertoireEntry.update({
  where: { songId: "song-id" },
  data: {
    lastPracticed: new Date(),
    practiceCount: { increment: 1 }
  }
});
```

### Promote to READY status

```typescript
await prisma.repertoireEntry.update({
  where: { songId: "song-id" },
  data: { status: "READY" }
});
```

### Update after performance

```typescript
// After marking a performance as completed
const performance = await prisma.performance.findUnique({
  where: { id: performanceId },
  include: { songs: true }
});

for (const perfSong of performance.songs) {
  await prisma.repertoireEntry.update({
    where: { songId: perfSong.songId },
    data: {
      lastPerformed: performance.date,
      performanceCount: { increment: 1 }
    }
  });
}
```

### Remove from repertoire

```typescript
await prisma.repertoireEntry.delete({
  where: { songId: "song-id" }
});
```

## Querying

### Get all performance-ready songs

```typescript
const readySongs = await prisma.song.findMany({
  where: {
    repertoireEntry: {
      status: { in: ["READY", "FEATURED"] }
    }
  },
  include: {
    artist: true,
    repertoireEntry: true
  }
});
```

### Get songs that need practice

```typescript
const needsPractice = await prisma.song.findMany({
  where: {
    repertoireEntry: {
      status: "LEARNING",
      lastPracticed: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // > 1 week ago
      }
    }
  }
});
```

### Get featured songs by performance count

```typescript
const topSongs = await prisma.song.findMany({
  where: {
    repertoireEntry: {
      status: "FEATURED"
    }
  },
  include: {
    repertoireEntry: true
  },
  orderBy: {
    repertoireEntry: {
      performanceCount: "desc"
    }
  },
  take: 10
});
```

### Suggest songs for setlist (not performed recently)

```typescript
const suggestions = await prisma.song.findMany({
  where: {
    repertoireEntry: {
      status: { in: ["READY", "FEATURED"] },
      OR: [
        { lastPerformed: null },
        {
          lastPerformed: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // > 30 days
          }
        }
      ]
    }
  }
});
```

## Public Repertoire Page

The public repertoire page automatically filters to only show songs with status `READY` or `FEATURED`. Songs that are `LEARNING` or `ARCHIVED` are hidden from public view.

## Migration Script

To add your existing songs to the repertoire, run:

```bash
npx tsx scripts/add-to-repertoire.ts
```

This will:
- Find all songs without a repertoire entry
- Create entries with status `READY` (you can modify the script to use `LEARNING` instead)
- Copy `originalKey` to `performedKey` and `tempo` to `performedTempo` as defaults

After running, you can customize individual songs through the admin interface.

## Performance/Setlist Integration

When creating a setlist (Performance):
1. Filter songs by `repertoireEntry.status` to show only READY/FEATURED
2. Display performance metadata (key, capo, notes) while building setlist
3. After the performance is marked complete, update all songs:
   - Set `lastPerformed` to performance date
   - Increment `performanceCount`
   - Optionally upgrade LEARNING → READY if performed successfully

## Best Practices

1. **Start with LEARNING** - Add new songs as LEARNING until you've performed them successfully
2. **Use FEATURED sparingly** - Reserve for your absolute best, most-requested songs
3. **Archive old songs** - Instead of deleting, mark as ARCHIVED so you have history
4. **Track practice** - Update `lastPracticed` to identify songs that need work
5. **Use notes liberally** - "Capo 2", "Skip verse 3", "Audience loves the bridge"
6. **Set energy levels** - Helps build balanced setlists (don't put 3 ballads in a row)
