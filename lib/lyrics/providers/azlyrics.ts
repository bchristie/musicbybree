import { JSDOM } from "jsdom";
import {
  LyricsProvider,
  LyricsResult,
  LyricsProviderConfig,
} from "../types";

/**
 * AZLyrics Provider
 * 
 * Scrapes lyrics from azlyrics.com
 * Does not support timing information.
 */
export class AZLyricsProvider extends LyricsProvider {
  constructor(config: LyricsProviderConfig = {}) {
    super({
      baseUrl: "https://azlyrics.com",
      ...config,
    });
  }

  get name(): string {
    return "azlyrics";
  }

  get supportsTiming(): boolean {
    return false;
  }

  async getLyrics(artist: string, title: string): Promise<LyricsResult | null> {
    const url = `${this.config.baseUrl}/lyrics/${this.cleanForUrl(artist)}/${this.cleanForUrl(title)}.html`;
    
    console.log(`[AZLyrics] Fetching: ${url}`);

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.config.timeout || 10000),
      });

      if (!response.ok) {
        console.warn(`[AZLyrics] HTTP ${response.status} for ${artist} - ${title}`);
        return null;
      }

      const html = await response.text();
      const { document: doc } = new JSDOM(html).window;
      
      // AZLyrics stores lyrics in a specific div structure
      const div = doc.querySelector(
        'div.main-page > div.row > div.text-center > div:not([class])'
      );

      if (!div || !div.textContent) {
        console.warn(`[AZLyrics] No lyrics found for ${artist} - ${title}`);
        return null;
      }

      // Clean up the text
      const cleanedText = (div.textContent || '')
        .trim()
        .replace(/^\[(.+)\]$/gm, '**[$1]**') // Bold section markers like [Chorus]
        .replace(/(\n(?!\n))/gm, '\\\n')      // Preserve line breaks
        .replace(/^\\$/gm, '');                // Remove standalone backslashes

      const lines = this.parseTextLines(cleanedText);

      return {
        lines,
        hasTiming: false,
        source: this.name,
        metadata: {
          confidence: 1.0,
          url,
        },
      };
    } catch (error) {
      console.error(
        `[AZLyrics] Error fetching lyrics for ${title} by ${artist}:`,
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }
}
