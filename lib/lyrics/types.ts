/**
 * Lyrics Provider Types
 * 
 * Defines the interface for lyrics providers and related data structures.
 */

export interface LyricLine {
  text: string;
  time?: number; // Timestamp in seconds (optional for untimed lyrics)
  order: number; // Line number for display ordering
}

export interface LyricsResult {
  lines: LyricLine[];
  hasTiming: boolean;
  source: string; // Provider name (e.g., "azlyrics", "musixmatch", "manual")
  metadata?: {
    confidence?: number; // 0-1 indicating match confidence
    duration?: number; // Song duration if known
    language?: string;
    [key: string]: any;
  };
}

export interface LyricsProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  [key: string]: any;
}

export abstract class LyricsProvider {
  protected config: LyricsProviderConfig;
  
  constructor(config: LyricsProviderConfig = {}) {
    this.config = {
      timeout: 10000,
      ...config,
    };
  }

  /**
   * Get the provider name
   */
  abstract get name(): string;

  /**
   * Indicates whether this provider supports timing information
   */
  abstract get supportsTiming(): boolean;

  /**
   * Fetch lyrics for a song
   * @param artist - Artist name
   * @param title - Song title
   * @returns LyricsResult with lyrics lines and metadata
   */
  abstract getLyrics(artist: string, title: string): Promise<LyricsResult | null>;

  /**
   * Clean a string for URL usage (can be overridden by providers)
   */
  protected cleanForUrl(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '');
  }

  /**
   * Parse plain text lyrics into LyricLine objects
   */
  protected parseTextLines(text: string): LyricLine[] {
    return text
      .trim()
      .split('\n')
      .map((line, index) => ({
        text: line.trim(),
        order: index + 1,
      }))
      .filter(line => line.text.length > 0);
  }
}
