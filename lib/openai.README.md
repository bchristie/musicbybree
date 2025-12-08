# OpenAI Integration

This module provides AI-powered features for the vocal portfolio app using OpenAI's API.

## Setup

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-...
```

## Available Functions

### Core Functions

#### `completion(systemPrompt, userPrompt, options?)`
Base function for OpenAI completions.

```typescript
import { completion } from '@/lib/openai';

const result = await completion(
  'You are a helpful assistant.',
  'What is the capital of France?',
  { model: 'gpt-4o-mini', temperature: 0.7, json: false }
);
```

#### `streamCompletion(systemPrompt, userPrompt, options?)`
Streaming completions for real-time responses.

```typescript
import { streamCompletion } from '@/lib/openai';

for await (const chunk of streamCompletion(
  'You are a helpful assistant.',
  'Tell me a story.'
)) {
  process.stdout.write(chunk);
}
```

### Music-Specific Functions

#### `findSong(songTitle, artistHint?)`
Get detailed information about a song.

```typescript
import { findSong } from '@/lib/openai';

const songInfo = await findSong('My Funny Valentine', 'Richard Rodgers');
// Returns: { title, artist, originalKey, tempo, durationSeconds, genre, era, mood }
```

#### `findArtist(artistName)`
Get information about an artist.

```typescript
import { findArtist } from '@/lib/openai';

const artistInfo = await findArtist('Ella Fitzgerald');
// Returns: { name, genre, era, description }
```

#### `enrichSongMetadata(song)`
Get AI suggestions for song metadata (genres, moods, etc).

```typescript
import { enrichSongMetadata } from '@/lib/openai';

const enriched = await enrichSongMetadata({
  title: 'Summertime',
  artist: 'George Gershwin',
  originalKey: 'Dm',
  tempo: 60
});
// Returns: { suggestedGenres, suggestedMoods, suggestedEra, keySignature, estimatedTempo }
```

#### `getSongLyrics(title, artist)`
Get song lyrics (respects copyright).

```typescript
import { getSongLyrics } from '@/lib/openai';

const lyrics = await getSongLyrics('Amazing Grace', 'Traditional');
// Returns: { hasLyrics, preview?, fullLyrics?, copyrightNotice? }
```

#### `getRecommendations(repertoire, count?)`
Get song recommendations based on current repertoire.

```typescript
import { getRecommendations } from '@/lib/openai';

const recommendations = await getRecommendations([
  { title: 'Fly Me to the Moon', artist: 'Bart Howard', genre: 'Jazz' },
  { title: 'At Last', artist: 'Etta James', genre: 'Blues' },
], 10);
// Returns: [{ title, artist, reason }, ...]
```

#### `parseSongInput(input)`
Parse natural language into structured song data.

```typescript
import { parseSongInput } from '@/lib/openai';

const songs = await parseSongInput(`
  My Funny Valentine by Richard Rodgers in Cm
  Summertime - George Gershwin
  At Last (Etta James)
`);
// Returns: [{ title, artist, key?, notes? }, ...]
```

## Usage Examples

### Admin Song Form Enhancement
```typescript
// In your song creation form
const handleAutoFill = async () => {
  const info = await findSong(title, artist);
  setFormData({
    ...formData,
    originalKey: info.originalKey,
    tempo: info.tempo,
    duration: info.durationSeconds,
  });
};
```

### Bulk Import
```typescript
// Allow users to paste a list of songs
const handleBulkImport = async (textInput: string) => {
  const songs = await parseSongInput(textInput);
  
  for (const song of songs) {
    // Enrich each song with metadata
    const enriched = await enrichSongMetadata(song);
    
    // Create in database with suggestions
    await createSong({
      ...song,
      suggestedTags: [...enriched.suggestedGenres, ...enriched.suggestedMoods]
    });
  }
};
```

### Smart Recommendations
```typescript
// On the dashboard, show recommended songs
const currentRepertoire = await prisma.song.findMany({
  include: { tags: true }
});

const recommendations = await getRecommendations(
  currentRepertoire.map(s => ({
    title: s.title,
    artist: s.artist,
    genre: s.tags.find(t => t.category === 'genre')?.name
  })),
  5
);
```

## Configuration

Default settings in `lib/openai.ts`:
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Temperature**: `0.7` (balanced creativity)

To use a different model:
```typescript
await completion(system, user, { model: 'gpt-4o' });
```

## Error Handling

All functions may throw errors. Wrap in try-catch:

```typescript
try {
  const info = await findSong('Invalid Song Name');
} catch (error) {
  console.error('Failed to find song:', error);
}
```

## Cost Considerations

- `gpt-4o-mini`: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- `gpt-4o`: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens

Use `gpt-4o-mini` for most operations. Reserve `gpt-4o` for complex tasks.
