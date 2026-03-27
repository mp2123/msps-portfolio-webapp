import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | null;
  prismaPool: Pool | null;
};

const getConnectionString = () =>
  process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim() || '';

export const getPrismaClient = () => {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  if (!globalForPrisma.prismaPool) {
    const isLocalDatabase =
      connectionString.includes('localhost') ||
      connectionString.includes('127.0.0.1');

    globalForPrisma.prismaPool = new Pool({
      connectionString,
      ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
    });
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.prismaPool);

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    });
  }

  return globalForPrisma.prisma;
};
