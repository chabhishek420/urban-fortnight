/**
 * Database Client
 *
 * Prisma client singleton for database access.
 *
 * @see keitaro_source/application/Core/Db/Db.php
 */
import { PrismaClient } from '@prisma/client';
/**
 * Get the Prisma client instance
 */
export declare function getDb(): PrismaClient;
/**
 * Close database connection
 */
export declare function closeDb(): Promise<void>;
/**
 * Reset database connection (for testing)
 */
export declare function resetDb(): void;
export declare const db: {
    readonly client: PrismaClient;
};
export { PrismaClient } from '@prisma/client';
export default getDb;
//# sourceMappingURL=db.d.ts.map