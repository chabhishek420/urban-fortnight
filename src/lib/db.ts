/**
 * Database Client
 * 
 * Prisma client singleton for database access.
 * 
 * @see keitaro_source/application/Core/Db/Db.php
 */

import { PrismaClient } from '@prisma/client';

// Prisma client singleton
let prisma: PrismaClient | null = null;

/**
 * Get the Prisma client instance
 */
export function getDb(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.DB_LOG_QUERIES === 'true' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }
  return prisma;
}

/**
 * Close database connection
 */
export async function closeDb(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

/**
 * Reset database connection (for testing)
 */
export function resetDb(): void {
  prisma = null;
}

// Database object with client property for backward compatibility
export const db = {
  get client(): PrismaClient {
    return getDb();
  }
};

// Re-export Prisma types and client
export { PrismaClient } from '@prisma/client';

// Default export
export default getDb;
