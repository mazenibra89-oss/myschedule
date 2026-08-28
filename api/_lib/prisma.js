import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma Client instances in serverless / hot-reloading environments
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
