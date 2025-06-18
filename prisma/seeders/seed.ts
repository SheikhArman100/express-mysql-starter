import { PrismaClient } from '@prisma/client';
import { seedUsers } from './user.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    // First seed users
    await seedUsers();
    console.log('\nAll seeds completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

