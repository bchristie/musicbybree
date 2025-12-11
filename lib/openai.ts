import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model configuration
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.7;

/**
 * Normalize key signature to use proper music symbols
 * Converts b to ♭ and # to ♯ for consistent formatting
 * Normalizes major/minor terminology
 */
function normalizeKeySignature(key: string | undefined | null): string | undefined {
  if (!key) return undefined;
  
  let normalized = key;
  
  // Replace 'b' with ♭ and '#' with ♯
  // Handle common formats like "Ab", "A♭", "C#", "C♯", "Bbm", "B♭m"
  normalized = normalized
    .replace(/([A-G])b/g, '$1♭')  // Ab → A♭
    .replace(/([A-G])#/g, '$1♯'); // C# → C♯
  
  // Normalize major/minor terminology
  // First handle variations before the space (if any)
  normalized = normalized
    .replace(/\s+Mjor/gi, ' Major')    // " Mjor" → " Major"
    .replace(/\s+major/g, ' Major')    // " major" → " Major"
    .replace(/\s+M$/g, ' Major')       // " M" → " Major"
    .replace(/\s+minor/g, ' Minor')    // " minor" → " Minor"
    .replace(/\s+m$/g, ' Minor');      // " m" → " Minor"
  
  // Handle cases with no space (e.g., "Cm" → "C Minor")
  normalized = normalized
    .replace(/^([A-G][♭♯]?)m$/g, '$1 Minor')     // "Cm" → "C Minor"
    .replace(/^([A-G][♭♯]?)M$/g, '$1 Major');    // "CM" → "C Major"
  
  return normalized;
}

/**
 * Base OpenAI completion function
 */
export async function completion(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string;
    temperature?: number;
    json?: boolean;
  }
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
    response_format: options?.json ? { type: 'json_object' } : { type: 'text' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Streaming completion function
 */
export async function* streamCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string;
    temperature?: number;
  }
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: options?.model || DEFAULT_MODEL,
    temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      yield content;
    }
  }
}

/**
 * Find song information using AI
 * Returns structured data about a song
 */
export async function findSong(songTitle: string, artistHint?: string): Promise<{
  title: string;
  artist: string;
  originalKey?: string;
  tempo?: number;
  durationSeconds?: number;
  genre?: string;
  era?: string;
  mood?: string;
}> {
  const systemPrompt = `You are a music database expert. When given a song title and optionally an artist, 
return accurate information about the song in JSON format. If you're not certain about specific details, 
omit them rather than guessing. Use this exact structure:
{
  "title": "Song title",
  "artist": "Artist name",
  "originalKey": "Key signature (optional, e.g., 'C', 'Am', 'Bb')",
  "tempo": 120,
  "durationSeconds": 180,
  "genre": "Primary genre (optional)",
  "era": "Time period (optional)",
  "mood": "Overall mood (optional)"
}
For tempo, provide BPM as a number. For duration, provide seconds as a number.`;

  const userPrompt = artistHint
    ? `Find information about the song "${songTitle}" by ${artistHint}`
    : `Find information about the song "${songTitle}"`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  const parsed = JSON.parse(response);
  
  // Normalize key signature format
  if (parsed.originalKey) {
    parsed.originalKey = normalizeKeySignature(parsed.originalKey);
  }
  
  return parsed;
}

/**
 * Find artist information using AI
 */
export async function findArtist(artistName: string): Promise<{
  name: string;
  genre?: string;
  era?: string;
  description?: string;
}> {
  const systemPrompt = `You are a music historian. When given an artist name, return accurate information 
about them in JSON format with the following structure:
{
  "name": "Artist name",
  "genre": "Primary genre (optional)",
  "era": "Time period/era (optional)",
  "description": "Brief description (optional)"
}`;

  const userPrompt = `Find information about the artist "${artistName}"`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  return JSON.parse(response);
}

/**
 * Enrich song metadata with AI suggestions
 */
export async function enrichSongMetadata(song: {
  title: string;
  artist: string;
  originalKey?: string;
  tempo?: number;
}): Promise<{
  suggestedGenres: string[];
  suggestedMoods: string[];
  suggestedEra?: string;
  keySignature?: string;
  estimatedTempo?: number;
}> {
  const systemPrompt = `You are a music cataloging expert. Given a song, suggest relevant metadata tags 
including genres, moods, era, and if missing, estimate key signature and tempo. Return JSON with this structure:
{
  "suggestedGenres": ["genre1", "genre2"],
  "suggestedMoods": ["mood1", "mood2"],
  "suggestedEra": "Time period (optional)",
  "keySignature": "Key (optional, only if not provided)",
  "estimatedTempo": 120
}`;

  const userPrompt = `Enrich metadata for: "${song.title}" by ${song.artist}
Current key: ${song.originalKey || 'unknown'}
Current tempo: ${song.tempo || 'unknown'} BPM`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  const parsed = JSON.parse(response);
  
  // Normalize key signature format
  if (parsed.keySignature) {
    parsed.keySignature = normalizeKeySignature(parsed.keySignature);
  }
  
  return parsed;
}

/**
 * Get song lyrics (with copyright awareness)
 * Returns lyrics in a format compatible with the Prisma LyricLine model
 */
export async function getSongLyrics(title: string, artist: string): Promise<{
  hasLyrics: boolean;
  hasTiming: boolean;
  lines: {
    text: string;
    time?: number; // Seconds from start (optional)
    order: number; // Line number for display order
  }[];
  source: string;
  copyrightNotice?: string;
}> {
  const systemPrompt = `You are a music lyrics assistant. You must respect copyright laws. 
For copyrighted songs, only provide a small preview (first verse or chorus) and include a copyright notice. 
For public domain songs, you can provide full lyrics.

Return JSON with this exact structure:
{
  "hasLyrics": true,
  "hasTiming": false,
  "lines": [
    {
      "text": "First line of lyrics",
      "time": 0.0,
      "order": 1
    },
    {
      "text": "Second line of lyrics",
      "time": 3.5,
      "order": 2
    }
  ],
  "source": "openai-preview" or "openai-public-domain",
  "copyrightNotice": "Copyright notice if applicable (optional)"
}

Each line should be a separate object in the "lines" array. The "order" field should start at 1 and increment for each line.

IMPORTANT - Timing Information:
- If you do NOT have accurate timing data, set "hasTiming" to false and omit the "time" field from each line
- If you DO have accurate timing data, set "hasTiming" to true and include "time" as a number representing seconds from the start of the song (e.g., 0.0, 3.5, 12.75)
- Time should be a floating point number in seconds, NOT a timestamp string
- Most likely you will NOT have timing data, so set "hasTiming" to false`;

  const userPrompt = `Get lyrics for "${title}" by ${artist}`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  return JSON.parse(response);
}

/**
 * Get song recommendations based on repertoire
 */
export async function getRecommendations(repertoire: {
  title: string;
  artist: string;
  genre?: string;
}[], count: number = 10): Promise<{
  title: string;
  artist: string;
  reason: string;
}[]> {
  const systemPrompt = `You are a music curator for a vocal performer. Based on their current repertoire, 
suggest ${count} additional songs that would complement their collection. Consider genre variety, vocal range requirements, 
audience appeal, and performance context. Return JSON array with this structure:
{
  "recommendations": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Brief explanation of why this fits"
    }
  ]
}`;

  const repertoireList = repertoire
    .map((song) => `"${song.title}" by ${song.artist}${song.genre ? ` (${song.genre})` : ''}`)
    .join('\n');

  const userPrompt = `Current repertoire:\n${repertoireList}\n\nSuggest ${count} new songs to add.`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  const parsed = JSON.parse(response);
  return parsed.recommendations || parsed;
}

/**
 * Extract song information from natural language
 * Useful for bulk imports or voice input
 */
export async function parseSongInput(input: string): Promise<{
  title: string;
  artist: string;
  key?: string;
  notes?: string;
}[]> {
  const systemPrompt = `You are a music catalog parser. Extract song information from natural language input. 
Handle various formats like "Song Title by Artist in Key of X" or simple lists. Return JSON with this structure:
{
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "key": "C (optional)",
      "notes": "Any additional notes (optional)"
    }
  ]
}`;

  const userPrompt = `Parse the following into structured song data:\n${input}`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  const parsed = JSON.parse(response);
  return parsed.songs || parsed;
}

/**
 * Get song suggestions for an artist
 * Returns array of song titles that complement existing repertoire
 */
export async function getSuggestedSongs(
  artistName: string,
  existingSongs: string[]
): Promise<string[]> {
  const systemPrompt = `You are a music repertoire assistant specializing in helping artists build comprehensive song lists.
Your task is to suggest popular, well-known songs that an artist commonly performs.`;

  const existingList = existingSongs.length > 0 
    ? `\n\nThe artist already has these songs:\n${existingSongs.join('\n')}`
    : '';

  const userPrompt = `Suggest 3-5 popular or commonly performed songs by ${artistName} that would complement their repertoire.${existingList}

Focus on:
- Well-known hits and signature songs
- Songs they're famous for performing
- Avoid suggesting songs already in their list

Return ONLY the song titles, one per line, without numbering, explanations, or additional text.`;

  const response = await completion(systemPrompt, userPrompt);
  
  // Parse response into array of titles, filter out empty lines
  const suggestions = response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    // Remove any numbering if present (1. , 1) , etc.)
    .map(line => line.replace(/^\d+[\.)]\s*/, ''))
    // Deduplicate against existing songs (case-insensitive)
    .filter(title => {
      const lowerTitle = title.toLowerCase();
      return !existingSongs.some(existing => existing.toLowerCase() === lowerTitle);
    });

  return suggestions;
}

export { openai };
