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
      
      // Use cheerio for HTML parsing (ESM-compatible)
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);
      
      // AZLyrics stores lyrics in a specific div structure
      const div = $('div.main-page > div.row > div.text-center > div:not([class])');

      if (!div.length || !div.text()) {
        console.warn(`[AZLyrics] No lyrics found for ${artist} - ${title}`);
        return null;
      }

      // Get the raw text and split into lines
      const rawText = div.text().trim();
      const textLines = rawText.split('\n');
      
      // Parse lines and detect paragraph breaks (blank lines)
      const lines = [];
      let order = 1;
      
      for (let i = 0; i < textLines.length; i++) {
        const text = textLines[i].trim();
        
        // Skip completely empty lines
        if (!text) continue;
        
        // Check if next line is empty (paragraph break)
        const nextLineEmpty = i + 1 < textLines.length && !textLines[i + 1].trim();
        const hasMoreContent = textLines.slice(i + 2).some(line => line.trim());
        
        lines.push({
          text,
          order: order++,
          breakAfter: nextLineEmpty && hasMoreContent, // Add break if next is empty and there's more content
        });
        
        // Skip the blank line we just detected
        if (nextLineEmpty) {
          i++;
        }
      }

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
