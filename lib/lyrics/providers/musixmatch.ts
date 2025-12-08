import {
  LyricsProvider,
  LyricsResult,
  LyricsProviderConfig,
  LyricLine,
} from "../types";

/**
 * Musixmatch Provider (Stub)
 * 
 * API provider for Musixmatch lyrics with timing support.
 * Requires API key: https://developer.musixmatch.com/
 * 
 * Note: This is a placeholder implementation. You'll need to:
 * 1. Sign up for a Musixmatch API key
 * 2. Implement the actual API calls per their documentation
 * 3. Handle rate limiting and error cases
 */
export class MusixmatchProvider extends LyricsProvider {
  constructor(config: LyricsProviderConfig = {}) {
    super(config);
    
    if (!this.config.apiKey) {
      console.warn("[Musixmatch] No API key provided. Provider will not function.");
    }
  }

  get name(): string {
    return "musixmatch";
  }

  get supportsTiming(): boolean {
    return true; // Musixmatch supports synced lyrics
  }

  async getLyrics(artist: string, title: string): Promise<LyricsResult | null> {
    if (!this.config.apiKey) {
      console.error("[Musixmatch] API key required");
      return null;
    }

    // TODO: Implement Musixmatch API integration
    // Example endpoints:
    // - track.search: Find track ID
    // - track.lyrics.get: Get lyrics
    // - track.subtitle.get: Get synced lyrics (with timing)
    
    console.log(`[Musixmatch] TODO: Implement API call for ${artist} - ${title}`);
    
    return null;
  }

  /**
   * Parse Musixmatch LRC format into LyricLine objects
   * LRC format example: [00:12.00]Line of lyrics
   */
  protected parseLRCFormat(lrcText: string): LyricLine[] {
    const lines: LyricLine[] = [];
    const lrcLines = lrcText.split('\n');
    
    let order = 1;
    for (const line of lrcLines) {
      const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
      
      if (match) {
        const [, minutes, seconds, centiseconds, text] = match;
        const time = 
          parseInt(minutes) * 60 + 
          parseInt(seconds) + 
          parseInt(centiseconds) / 100;
        
        if (text.trim()) {
          lines.push({
            text: text.trim(),
            time,
            order: order++,
          });
        }
      }
    }
    
    return lines;
  }
}
