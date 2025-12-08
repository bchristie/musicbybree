import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model configuration
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.7;

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
omit them rather than guessing. For tempo, provide BPM as a number. For duration, provide seconds as a number.`;

  const userPrompt = artistHint
    ? `Find information about the song "${songTitle}" by ${artistHint}`
    : `Find information about the song "${songTitle}"`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  return JSON.parse(response);
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
about them in JSON format. Include their primary genre, the era they're associated with, and a brief description.`;

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
including genres, moods, era, and if missing, estimate key signature and tempo. Return as JSON.`;

  const userPrompt = `Enrich metadata for: "${song.title}" by ${song.artist}
Current key: ${song.originalKey || 'unknown'}
Current tempo: ${song.tempo || 'unknown'} BPM`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  return JSON.parse(response);
}

/**
 * Get song lyrics (with copyright awareness)
 */
export async function getSongLyrics(title: string, artist: string): Promise<{
  hasLyrics: boolean;
  preview?: string;
  fullLyrics?: string;
  copyrightNotice?: string;
}> {
  const systemPrompt = `You are a music lyrics assistant. You must respect copyright laws. 
For copyrighted songs, only provide a small preview (first verse or chorus) and a copyright notice. 
For public domain songs, you can provide full lyrics. Return as JSON.`;

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
audience appeal, and performance context. Return as JSON array.`;

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
Handle various formats like "Song Title by Artist in Key of X" or simple lists. Return as JSON array of songs.`;

  const userPrompt = `Parse the following into structured song data:\n${input}`;

  const response = await completion(systemPrompt, userPrompt, { json: true });
  const parsed = JSON.parse(response);
  return parsed.songs || parsed;
}

export { openai };
