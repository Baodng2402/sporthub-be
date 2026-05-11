import { prisma } from '../lib/prisma';

async function main() {
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: 'alice@sporthub.local',
      name: 'Alice Coach',
      bookings: {
        create: [
          {
            title: 'Morning futsal court',
            startsAt: new Date('2026-06-01T08:00:00.000Z'),
          },
          {
            title: 'Evening tennis court',
            startsAt: new Date('2026-06-02T18:00:00.000Z'),
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'ben@sporthub.local',
      name: 'Ben Player',
      bookings: {
        create: {
          title: 'Weekend basketball slot',
          startsAt: new Date('2026-06-06T10:00:00.000Z'),
        },
      },
    },
  });

  const users = await prisma.user.count();
  const bookings = await prisma.booking.count();

  console.log(`Seeded ${users} users and ${bookings} bookings`);
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
