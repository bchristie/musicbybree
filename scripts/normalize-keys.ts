import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Normalize key signature to use proper music symbols
 * Converts b to ♭ and # to ♯ for consistent formatting
 * Normalizes major/minor terminology
 */
function normalizeKeySignature(key: string | null): string | null {
  if (!key) return null;
  
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

async function normalizeDatabase() {
  console.log('🎵 Starting key signature normalization...\n');

  try {
    // Get all songs with a key signature
    const songs = await prisma.song.findMany({
      where: {
        originalKey: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        originalKey: true,
        artist: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Found ${songs.length} songs with key signatures\n`);

    let updatedCount = 0;
    let unchangedCount = 0;

    for (const song of songs) {
      const normalized = normalizeKeySignature(song.originalKey);
      
      if (normalized !== song.originalKey) {
        console.log(`📝 "${song.title}" by ${song.artist.name}`);
        console.log(`   ${song.originalKey} → ${normalized}`);
        
        await prisma.song.update({
          where: { id: song.id },
          data: { originalKey: normalized },
        });
        
        updatedCount++;
      } else {
        unchangedCount++;
      }
    }

    console.log(`\n✅ Normalization complete!`);
    console.log(`   Updated: ${updatedCount} songs`);
    console.log(`   Unchanged: ${unchangedCount} songs`);

  } catch (error) {
    console.error('❌ Error normalizing keys:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

normalizeDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
