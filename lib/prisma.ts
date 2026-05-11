import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PrismaClient as PrismaClientType } from '../generated/prisma';
import path from 'node:path';

const generatedPrismaPath = path.join(process.cwd(), 'generated', 'prisma');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require(generatedPrismaPath) as {
  PrismaClient: new (options: { adapter: PrismaPg }) => PrismaClientType;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
