import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Only run seed if PRISMA_SEED environment variable is set to 'true'
  if (process.env.PRISMA_SEED !== 'true') {
    console.log('Skipping seed: PRISMA_SEED is not set to "true"');
    return;
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
  const ettaJames = await prisma.artist.upsert({
    where: { name: 'Etta James' },
    update: {},
    create: {
      name: 'Etta James',
      genre: 'Blues',
      era: '1950s-2000s',
      description: 'American singer known for her powerful voice and emotive performances in blues, R&B, soul, and jazz.',
    },
  });

  console.log('Artist created/updated:', ettaJames.name);

  // Create sample tags
  const bluesTag = await prisma.tag.upsert({
    where: { name: 'Blues' },
    update: {},
    create: {
      name: 'Blues',
      category: 'genre',
      color: '#1E40AF',
    },
  });

  const romanticTag = await prisma.tag.upsert({
    where: { name: 'Romantic' },
    update: {},
    create: {
      name: 'Romantic',
      category: 'mood',
      color: '#EC4899',
    },
  });

  console.log('Tags created/updated:', bluesTag.name, romanticTag.name);

  // Create sample song
  const atLast = await prisma.song.upsert({
    where: { id: 'seed-at-last' }, // Using a fixed ID for idempotent seeding
    update: {},
    create: {
      id: 'seed-at-last',
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
