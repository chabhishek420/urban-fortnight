"use strict";
/**
 * Database Client
 *
 * Prisma client singleton for database access.
 *
 * @see keitaro_source/application/Core/Db/Db.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = exports.db = void 0;
exports.getDb = getDb;
exports.closeDb = closeDb;
exports.resetDb = resetDb;
const client_1 = require("@prisma/client");
// Prisma client singleton
let prisma = null;
/**
 * Get the Prisma client instance
 */
function getDb() {
    if (!prisma) {
        prisma = new client_1.PrismaClient({
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
async function closeDb() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}
/**
 * Reset database connection (for testing)
 */
function resetDb() {
    prisma = null;
}
// Database object with client property for backward compatibility
exports.db = {
    get client() {
        return getDb();
    }
};
// Re-export Prisma types and client
var client_2 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_2.PrismaClient; } });
// Default export
exports.default = getDb;
//# sourceMappingURL=db.js.map