"use strict";
/**
 * Database Configuration
 *
 * Database connection settings for MySQL/SQLite via Prisma.
 *
 * @see keitaro_source/application/Core/Db/Db.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigSchema = exports.DatabaseProvider = void 0;
exports.loadDatabaseConfig = loadDatabaseConfig;
exports.getDatabaseConfig = getDatabaseConfig;
exports.buildDatabaseUrl = buildDatabaseUrl;
const zod_1 = require("zod");
/**
 * Database provider types
 */
exports.DatabaseProvider = {
    MYSQL: 'mysql',
    SQLITE: 'sqlite',
    POSTGRESQL: 'postgresql',
};
/**
 * Database configuration schema
 */
exports.DatabaseConfigSchema = zod_1.z.object({
    provider: zod_1.z.enum(['mysql', 'sqlite', 'postgresql']).default('sqlite'),
    // MySQL/PostgreSQL settings
    host: zod_1.z.string().default('localhost'),
    port: zod_1.z.number().int().min(1).max(65535).default(3306),
    database: zod_1.z.string().default('keitaro'),
    username: zod_1.z.string().default('keitaro'),
    password: zod_1.z.string().default(''),
    // SQLite settings
    sqlitePath: zod_1.z.string().default('./data/keitaro.db'),
    // Connection pool
    poolMin: zod_1.z.number().int().min(0).default(2),
    poolMax: zod_1.z.number().int().min(1).default(10),
    connectionTimeout: zod_1.z.number().default(30000),
    idleTimeout: zod_1.z.number().default(10000),
    // SSL
    sslEnabled: zod_1.z.boolean().default(false),
    sslRejectUnauthorized: zod_1.z.boolean().default(true),
    // Debug
    debug: zod_1.z.boolean().default(false),
    logQueries: zod_1.z.boolean().default(false),
});
/**
 * Load database configuration from environment
 */
function loadDatabaseConfig() {
    const dbUrl = process.env.DATABASE_URL;
    // Parse DATABASE_URL if provided
    if (dbUrl) {
        try {
            const url = new URL(dbUrl);
            const provider = url.protocol.replace(':', '');
            return exports.DatabaseConfigSchema.parse({
                provider: provider === 'file' || provider === 'sqlite' ? 'sqlite' : provider,
                host: url.hostname,
                port: parseInt(url.port, 10) || (provider === 'mysql' ? 3306 : 5432),
                database: url.pathname.slice(1),
                username: url.username,
                password: url.password,
                sqlitePath: provider === 'file' || provider === 'sqlite' ? url.pathname : undefined,
                poolMin: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
                poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
                connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '30000', 10),
                idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT ?? '10000', 10),
                sslEnabled: process.env.DB_SSL === 'true',
                sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
                debug: process.env.DB_DEBUG === 'true',
                logQueries: process.env.DB_LOG_QUERIES === 'true',
            });
        }
        catch {
            // Fall through to individual env vars
        }
    }
    return exports.DatabaseConfigSchema.parse({
        provider: process.env.DB_PROVIDER ?? 'sqlite',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '3306', 10),
        database: process.env.DB_DATABASE ?? 'keitaro',
        username: process.env.DB_USERNAME ?? 'keitaro',
        password: process.env.DB_PASSWORD ?? '',
        sqlitePath: process.env.DB_SQLITE_PATH ?? './data/keitaro.db',
        poolMin: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
        poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '30000', 10),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT ?? '10000', 10),
        sslEnabled: process.env.DB_SSL === 'true',
        sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        debug: process.env.DB_DEBUG === 'true',
        logQueries: process.env.DB_LOG_QUERIES === 'true',
    });
}
/**
 * Database configuration singleton
 */
let dbConfig = null;
/**
 * Get database configuration (singleton)
 */
function getDatabaseConfig() {
    if (!dbConfig) {
        dbConfig = loadDatabaseConfig();
    }
    return dbConfig;
}
/**
 * Build Prisma database URL from configuration
 */
function buildDatabaseUrl(config = getDatabaseConfig()) {
    if (config.provider === 'sqlite') {
        return `file:${config.sqlitePath}`;
    }
    const auth = config.password
        ? `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}`
        : encodeURIComponent(config.username);
    const host = config.port
        ? `${config.host}:${config.port}`
        : config.host;
    const params = new URLSearchParams();
    if (config.sslEnabled) {
        params.set('ssl', 'true');
        params.set('sslrejectUnauthorized', String(config.sslRejectUnauthorized));
    }
    const queryString = params.toString();
    return `${config.provider}://${auth}@${host}/${config.database}${queryString ? `?${queryString}` : ''}`;
}
//# sourceMappingURL=database.js.map