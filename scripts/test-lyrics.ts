/**
 * Test script for lyrics providers
 * 
 * Usage: npx tsx scripts/test-lyrics.ts
 */

import { lyricsService, createLyricsProvider } from "../lib/lyrics";

async function testLyrics() {
  console.log("=".repeat(60));
  console.log("Testing Lyrics Providers");
  console.log("=".repeat(60));
  console.log();

  // Test 1: Using the service (tries all providers)
  console.log("Test 1: Fetch using LyricsService (with fallback)");
  console.log("-".repeat(60));
  const result1 = await lyricsService.getLyrics("Amy Winehouse", "Back to Black");
  
  if (result1) {
    console.log(`✓ Found lyrics via ${result1.source}`);
    console.log(`  Lines: ${result1.lines.length}`);
    console.log(`  Has timing: ${result1.hasTiming}`);
    console.log(`  First 3 lines:`);
    result1.lines.slice(0, 3).forEach(line => {
      console.log(`    [${line.order}] ${line.text}`);
    });
  } else {
    console.log("✗ No lyrics found");
  }
  console.log();

  // Test 2: Directly use AZLyrics provider
  console.log("Test 2: Direct AZLyrics provider");
  console.log("-".repeat(60));
  const azProvider = createLyricsProvider("azlyrics");
  const result2 = await azProvider.getLyrics("Etta James", "At Last");
  
  if (result2) {
    console.log(`✓ Found lyrics via ${result2.source}`);
    console.log(`  Lines: ${result2.lines.length}`);
    console.log(`  Has timing: ${result2.hasTiming}`);
    console.log(`  First 3 lines:`);
    result2.lines.slice(0, 3).forEach(line => {
      console.log(`    [${line.order}] ${line.text}`);
    });
  } else {
    console.log("✗ No lyrics found");
  }
  console.log();

  // Test 3: Test with non-existent song
  console.log("Test 3: Non-existent song (should fail gracefully)");
  console.log("-".repeat(60));
  const result3 = await lyricsService.getLyrics("Unknown Artist", "Fake Song Title");
  
  if (result3) {
    console.log(`✓ Unexpectedly found lyrics`);
  } else {
    console.log("✓ Correctly returned null for non-existent song");
  }
  console.log();

  console.log("=".repeat(60));
  console.log("Tests complete");
  console.log("=".repeat(60));
}

testLyrics().catch(console.error);
