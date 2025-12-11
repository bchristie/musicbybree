import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Slug generation utility
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateArtistSlug(name) {
  return slugify(name);
}

function generateTagSlug(name) {
  return slugify(name);
}

function generateSongSlug(artistName, songTitle) {
  const artistSlug = slugify(artistName);
  const songSlug = slugify(songTitle);
  return `${artistSlug}-${songSlug}`;
}

async function main() {
  // Only run seed if PRISMA_SEED environment variable is set to 'true'
  if (process.env.PRISMA_SEED !== 'true') {
    console.log('Skipping seed: PRISMA_SEED is not set to "true"');
    return;
  }

  if (process.env.SEED_RESET === 'true') {
    console.log('Resetting database...');
    // Delete in order to respect foreign key constraints
    await prisma.repertoireEntry.deleteMany();
    await prisma.performance.deleteMany();
    await prisma.songTag.deleteMany();
    await prisma.song.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database reset completed.');
  }

  console.log('Starting database seed...');

  // Create/update admin user if credentials are provided
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    // Import bcrypt dynamically for ESM compatibility
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(process.env.ADMIN_PASSWORD, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: {
        password: hashedPassword,
      },
      create: {
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Admin User',
      },
    });

    console.log('Admin user upserted:', admin.email);
  } else {
    console.log('Skipping admin user creation: ADMIN_EMAIL and ADMIN_PASSWORD not provided');
  }

  // Create sample artist and song
  const ettaJamesSlug = generateArtistSlug('Etta James');
  const ettaJames = await prisma.artist.upsert({
    where: { id: ettaJamesSlug },
    update: {},
    create: {
      id: ettaJamesSlug,
      name: 'Etta James',
      genre: 'Blues',
      era: '1950s-2000s',
      description: 'American singer known for her powerful voice and emotive performances in blues, R&B, soul, and jazz.',
    },
  });

  console.log('Artist created/updated:', ettaJames.name);

  // Create Amy Winehouse
  const amyWinehouseSlug = generateArtistSlug('Amy Winehouse');
  const amyWinehouse = await prisma.artist.upsert({
    where: { id: amyWinehouseSlug },
    update: {},
    create: {
      id: amyWinehouseSlug,
      name: 'Amy Winehouse',
      genre: 'Soul',
      era: '2000s-2010s',
      description: 'British singer-songwriter known for her deep, expressive contralto vocals and her eclectic mix of soul, jazz, and R&B.',
    },
  });

  console.log('Artist created/updated:', amyWinehouse.name);

  // Create sample tags
  const bluesSlug = generateTagSlug('Blues');
  const bluesTag = await prisma.tag.upsert({
    where: { id: bluesSlug },
    update: {},
    create: {
      id: bluesSlug,
      name: 'Blues',
      category: 'genre',
      color: '#1E40AF',
    },
  });

  const romanticSlug = generateTagSlug('Romantic');
  const romanticTag = await prisma.tag.upsert({
    where: { id: romanticSlug },
    update: {},
    create: {
      id: romanticSlug,
      name: 'Romantic',
      category: 'mood',
      color: '#EC4899',
    },
  });

  const soulSlug = generateTagSlug('Soul');
  const soulTag = await prisma.tag.upsert({
    where: { id: soulSlug },
    update: {},
    create: {
      id: soulSlug,
      name: 'Soul',
      category: 'genre',
      color: '#7C3AED',
    },
  });

  const jazzSlug = generateTagSlug('Jazz');
  const jazzTag = await prisma.tag.upsert({
    where: { id: jazzSlug },
    update: {},
    create: {
      id: jazzSlug,
      name: 'Jazz',
      category: 'genre',
      color: '#059669',
    },
  });

  const retroSlug = generateTagSlug('Retro');
  const retroTag = await prisma.tag.upsert({
    where: { id: retroSlug },
    update: {},
    create: {
      id: retroSlug,
      name: 'Retro',
      category: 'mood',
      color: '#D97706',
    },
  });

  const powerfulSlug = generateTagSlug('Powerful');
  const powerfulTag = await prisma.tag.upsert({
    where: { id: powerfulSlug },
    update: {},
    create: {
      id: powerfulSlug,
      name: 'Powerful',
      category: 'mood',
      color: '#DC2626',
    },
  });

  console.log('Tags created/updated:', bluesTag.name, romanticTag.name, soulTag.name, jazzTag.name, retroTag.name, powerfulTag.name);

  // Create sample song
  const atLastSlug = generateSongSlug('Etta James', 'At Last');
  const atLast = await prisma.song.upsert({
    where: { id: atLastSlug },
    update: {},
    create: {
      id: atLastSlug,
      title: 'At Last',
      artistId: ettaJames.id,
      originalKey: 'F',
      tempo: 60,
      duration: 180,
      notes: 'Classic blues ballad, perfect for romantic occasions',
      tags: {
        create: [
          { tagId: bluesTag.id },
          { tagId: romanticTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', atLast.title);

  // Create Amy Winehouse songs
  const valerie = await prisma.song.upsert({
    where: { id: generateSongSlug('Amy Winehouse', 'Valerie') },
    update: {},
    create: {
      id: generateSongSlug('Amy Winehouse', 'Valerie'),
      title: 'Valerie',
      artistId: amyWinehouse.id,
      originalKey: 'C',
      tempo: 124,
      duration: 229,
      notes: 'Upbeat soul cover, very popular for performances',
      tags: {
        create: [
          { tagId: soulTag.id },
          { tagId: retroTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', valerie.title);

  const backToBlack = await prisma.song.upsert({
    where: { id: generateSongSlug('Amy Winehouse', 'Back to Black') },
    update: {},
    create: {
      id: generateSongSlug('Amy Winehouse', 'Back to Black'),
      title: 'Back to Black',
      artistId: amyWinehouse.id,
      originalKey: 'Dm',
      tempo: 98,
      duration: 241,
      notes: 'Signature song with soulful, melancholic feel',
      tags: {
        create: [
          { tagId: soulTag.id },
          { tagId: jazzTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', backToBlack.title);

  const rehab = await prisma.song.upsert({
    where: { id: generateSongSlug('Amy Winehouse', 'Rehab') },
    update: {},
    create: {
      id: generateSongSlug('Amy Winehouse', 'Rehab'),
      title: 'Rehab',
      artistId: amyWinehouse.id,
      originalKey: 'G',
      tempo: 118,
      duration: 213,
      notes: 'Bold, powerful anthem with retro soul vibe',
      tags: {
        create: [
          { tagId: soulTag.id },
          { tagId: powerfulTag.id },
          { tagId: retroTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', rehab.title);

  const tears = await prisma.song.upsert({
    where: { id: generateSongSlug('Amy Winehouse', 'Tears Dry on Their Own') },
    update: {},
    create: {
      id: generateSongSlug('Amy Winehouse', 'Tears Dry on Their Own'),
      title: 'Tears Dry on Their Own',
      artistId: amyWinehouse.id,
      originalKey: 'A',
      tempo: 104,
      duration: 183,
      notes: 'Motown-influenced track with smooth groove',
      tags: {
        create: [
          { tagId: soulTag.id },
          { tagId: retroTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', tears.title);

  const loveIsALosingGame = await prisma.song.upsert({
    where: { id: generateSongSlug('Amy Winehouse', 'Love Is a Losing Game') },
    update: {},
    create: {
      id: generateSongSlug('Amy Winehouse', 'Love Is a Losing Game'),
      title: 'Love Is a Losing Game',
      artistId: amyWinehouse.id,
      originalKey: 'F',
      tempo: 70,
      duration: 155,
      notes: 'Stripped down, emotional ballad with jazz influences',
      tags: {
        create: [
          { tagId: jazzTag.id },
          { tagId: romanticTag.id },
        ],
      },
    },
  });

  console.log('Song created/updated:', loveIsALosingGame.title);

  // Create repertoire entries for all seeded songs
  console.log('Creating repertoire entries...');

  // At Last - Featured song (romantic standard)
  await prisma.repertoireEntry.upsert({
    where: { songId: atLast.id },
    update: {
      status: 'FEATURED',
      performedKey: 'F',
      performedTempo: 60,
      typicalDuration: 180,
      notes: 'Classic opener for romantic sets. Guitar fingerstyle intro, build to full arrangement.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
      difficulty: 2,
      vocallyDemanding: false,
      energyLevel: 2,
      worksWellFor: 'weddings, romantic dinners, jazz clubs',
      lastPracticed: new Date(),
      practiceCount: 50,
      performanceCount: 25,
    },
    create: {
      songId: atLast.id,
      status: 'FEATURED',
      performedKey: 'F',
      performedTempo: 60,
      typicalDuration: 180,
      notes: 'Classic opener for romantic sets. Guitar fingerstyle intro, build to full arrangement.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
      difficulty: 2,
      vocallyDemanding: false,
      energyLevel: 2,
      worksWellFor: 'weddings, romantic dinners, jazz clubs',
      addedAt: new Date('2024-01-15'),
      lastPracticed: new Date(),
      practiceCount: 50,
      performanceCount: 25,
    },
  });

  // Valerie - Featured upbeat song
  await prisma.repertoireEntry.upsert({
    where: { songId: valerie.id },
    update: {
      status: 'FEATURED',
      performedKey: 'C',
      performedTempo: 124,
      typicalDuration: 220,
      notes: 'Crowd favorite! Keep it energetic, encourage audience participation on chorus.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus x2-Outro',
      difficulty: 3,
      vocallyDemanding: true,
      energyLevel: 5,
      worksWellFor: 'corporate events, parties, festivals',
      lastPracticed: new Date(),
      practiceCount: 45,
      performanceCount: 30,
    },
    create: {
      songId: valerie.id,
      status: 'FEATURED',
      performedKey: 'C',
      performedTempo: 124,
      typicalDuration: 220,
      notes: 'Crowd favorite! Keep it energetic, encourage audience participation on chorus.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus x2-Outro',
      difficulty: 3,
      vocallyDemanding: true,
      energyLevel: 5,
      worksWellFor: 'corporate events, parties, festivals',
      addedAt: new Date('2024-02-01'),
      lastPracticed: new Date(),
      practiceCount: 45,
      performanceCount: 30,
    },
  });

  // Back to Black - Ready
  await prisma.repertoireEntry.upsert({
    where: { songId: backToBlack.id },
    update: {},
    create: {
      songId: backToBlack.id,
      status: 'READY',
      performedKey: 'Dm',
      performedTempo: 98,
      typicalDuration: 240,
      notes: 'Soulful and moody. Focus on vocal expression, less is more on instrumentation.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
      difficulty: 4,
      vocallyDemanding: true,
      energyLevel: 2,
      worksWellFor: 'jazz clubs, intimate venues',
      avoidAfter: "Don't follow with another slow song",
      addedAt: new Date('2024-03-10'),
      lastPracticed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      practiceCount: 20,
      performanceCount: 8,
    },
  });

  // Rehab - Featured powerful song
  await prisma.repertoireEntry.upsert({
    where: { songId: rehab.id },
    update: {
      status: 'FEATURED',
      performedKey: 'G',
      performedTempo: 118,
      typicalDuration: 210,
      notes: 'High energy! Strong brass section if available, otherwise emphasize guitar riff.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus x2',
      difficulty: 4,
      vocallyDemanding: true,
      energyLevel: 5,
      worksWellFor: 'festivals, larger venues, upbeat sets',
      lastPracticed: new Date(),
      practiceCount: 35,
      performanceCount: 18,
    },
    create: {
      songId: rehab.id,
      status: 'FEATURED',
      performedKey: 'G',
      performedTempo: 118,
      typicalDuration: 210,
      notes: 'High energy! Strong brass section if available, otherwise emphasize guitar riff.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus x2',
      difficulty: 4,
      vocallyDemanding: true,
      energyLevel: 5,
      worksWellFor: 'festivals, larger venues, upbeat sets',
      addedAt: new Date('2024-02-20'),
      lastPracticed: new Date(),
      practiceCount: 35,
      performanceCount: 18,
    },
  });

  // Tears Dry on Their Own - Ready
  await prisma.repertoireEntry.upsert({
    where: { songId: tears.id },
    update: {},
    create: {
      songId: tears.id,
      status: 'READY',
      performedKey: 'A',
      performedTempo: 104,
      typicalDuration: 180,
      notes: 'Smooth Motown groove. Keep the rhythm tight, less vocal runs, stay true to melody.',
      arrangement: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
      difficulty: 3,
      vocallyDemanding: false,
      energyLevel: 3,
      worksWellFor: 'background music, brunch sets, casual venues',
      addedAt: new Date('2024-03-25'),
      lastPracticed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      practiceCount: 15,
      performanceCount: 5,
    },
  });

  // Love Is a Losing Game - Learning (newest addition)
  await prisma.repertoireEntry.upsert({
    where: { songId: loveIsALosingGame.id },
    update: {
      status: 'LEARNING',
      performedKey: 'F',
      performedTempo: 70,
      typicalDuration: 155,
      notes: 'Still working on the emotional delivery. Stripped arrangement - voice and minimal accompaniment.',
      arrangement: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
      difficulty: 5,
      vocallyDemanding: true,
      energyLevel: 1,
      worksWellFor: 'intimate settings, acoustic sets',
      lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      practiceCount: 8,
      performanceCount: 0,
    },
    create: {
      songId: loveIsALosingGame.id,
      status: 'LEARNING',
      performedKey: 'F',
      performedTempo: 70,
      typicalDuration: 155,
      notes: 'Still working on the emotional delivery. Stripped arrangement - voice and minimal accompaniment.',
      arrangement: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
      difficulty: 5,
      vocallyDemanding: true,
      energyLevel: 1,
      worksWellFor: 'intimate settings, acoustic sets',
      addedAt: new Date('2024-11-01'),
      lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      practiceCount: 8,
      performanceCount: 0,
    },
  });

  console.log('Repertoire entries created/updated for all songs!');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
