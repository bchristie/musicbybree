import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
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

  // Add your seed logic here
  // Example: Create sample tags
  // const jazzTag = await prisma.tag.upsert({
  //   where: { name: 'Jazz' },
  //   update: {},
  //   create: {
  //     name: 'Jazz',
  //     category: 'genre',
  //     color: '#3B82F6',
  //   },
  // });

  // Example: Create sample songs
  // const song = await prisma.song.upsert({
  //   where: { title_artist: { title: 'My Funny Valentine', artist: 'Richard Rodgers' } },
  //   update: {},
  //   create: {
  //     title: 'My Funny Valentine',
  //     artist: 'Richard Rodgers',
  //     key: 'Cm',
  //     tempo: 'Ballad',
  //     durationSeconds: 180,
  //     notes: 'Classic jazz standard',
  //     tags: {
  //       connect: [{ id: jazzTag.id }],
  //     },
  //   },
  // });

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
