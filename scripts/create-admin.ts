import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Helper script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

async function main() {
  const email = process.env.ADMIN_USERNAME || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin User";

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("User already exists!");
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log("Admin user created successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("User ID:", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
