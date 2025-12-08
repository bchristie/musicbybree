/**
 * Lyrics Service
 * 
 * Factory and management for lyrics providers
 */

import { AZLyricsProvider } from "./providers/azlyrics";
import { MusixmatchProvider } from "./providers/musixmatch";
import { LyricsProvider, LyricsProviderConfig, LyricsResult } from "./types";

export type LyricsProviderType = "azlyrics" | "musixmatch";

/**
 * Create a lyrics provider instance
 */
export function createLyricsProvider(
  provider: LyricsProviderType,
  config?: LyricsProviderConfig
): LyricsProvider {
  switch (provider) {
    case "azlyrics":
      return new AZLyricsProvider(config);
    case "musixmatch":
      return new MusixmatchProvider(config);
    default:
      throw new Error(`Unknown lyrics provider: ${provider}`);
  }
}

/**
 * LyricsService - Main service for fetching lyrics
 * 
 * Manages multiple providers with fallback support
 */
export class LyricsService {
  private providers: LyricsProvider[];

  constructor(providers: LyricsProvider[] = []) {
    this.providers = providers.length > 0 
      ? providers 
      : [new AZLyricsProvider()]; // Default to AZLyrics
  }

  /**
   * Add a provider to the service
   */
  addProvider(provider: LyricsProvider): void {
    this.providers.push(provider);
  }

  /**
   * Get lyrics from the first available provider
   * Tries providers in order until one succeeds
   */
  async getLyrics(artist: string, title: string): Promise<LyricsResult | null> {
    for (const provider of this.providers) {
      try {
        console.log(`[LyricsService] Trying provider: ${provider.name}`);
        const result = await provider.getLyrics(artist, title);
        
        if (result && result.lines.length > 0) {
          console.log(`[LyricsService] Success with ${provider.name}`);
          return result;
        }
      } catch (error) {
        console.error(
          `[LyricsService] Provider ${provider.name} failed:`,
          error instanceof Error ? error.message : String(error)
        );
        // Continue to next provider
      }
    }

    console.warn(`[LyricsService] No lyrics found for ${artist} - ${title}`);
    return null;
  }

  /**
   * Get lyrics from a specific provider
   */
  async getLyricsFromProvider(
    provider: LyricsProviderType,
    artist: string,
    title: string,
    config?: LyricsProviderConfig
  ): Promise<LyricsResult | null> {
    const lyricsProvider = createLyricsProvider(provider, config);
    return lyricsProvider.getLyrics(artist, title);
  }
}

// Export singleton instance
export const lyricsService = new LyricsService();

// Re-export types and providers for convenience
export * from "./types";
export { AZLyricsProvider } from "./providers/azlyrics";
export { MusixmatchProvider } from "./providers/musixmatch";
