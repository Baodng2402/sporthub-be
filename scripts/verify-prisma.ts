import { prisma } from '../lib/prisma';

async function main() {
  await prisma.user.findMany({
    take: 1,
    select: {
      id: true,
    },
  });

  console.log('✅ Connected');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
