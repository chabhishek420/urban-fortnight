/**
 * Database Configuration
 *
 * Database connection settings for MySQL/SQLite via Prisma.
 *
 * @see keitaro_source/application/Core/Db/Db.php
 */
import { z } from 'zod';
/**
 * Database provider types
 */
export declare const DatabaseProvider: {
    readonly MYSQL: "mysql";
    readonly SQLITE: "sqlite";
    readonly POSTGRESQL: "postgresql";
};
export type DatabaseProviderType = typeof DatabaseProvider[keyof typeof DatabaseProvider];
/**
 * Database configuration schema
 */
export declare const DatabaseConfigSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<["mysql", "sqlite", "postgresql"]>>;
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodNumber>;
    database: z.ZodDefault<z.ZodString>;
    username: z.ZodDefault<z.ZodString>;
    password: z.ZodDefault<z.ZodString>;
    sqlitePath: z.ZodDefault<z.ZodString>;
    poolMin: z.ZodDefault<z.ZodNumber>;
    poolMax: z.ZodDefault<z.ZodNumber>;
    connectionTimeout: z.ZodDefault<z.ZodNumber>;
    idleTimeout: z.ZodDefault<z.ZodNumber>;
    sslEnabled: z.ZodDefault<z.ZodBoolean>;
    sslRejectUnauthorized: z.ZodDefault<z.ZodBoolean>;
    debug: z.ZodDefault<z.ZodBoolean>;
    logQueries: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    port: number;
    host: string;
    debug: boolean;
    provider: "mysql" | "sqlite" | "postgresql";
    database: string;
    username: string;
    password: string;
    sqlitePath: string;
    poolMin: number;
    poolMax: number;
    connectionTimeout: number;
    idleTimeout: number;
    sslEnabled: boolean;
    sslRejectUnauthorized: boolean;
    logQueries: boolean;
}, {
    port?: number | undefined;
    host?: string | undefined;
    debug?: boolean | undefined;
    provider?: "mysql" | "sqlite" | "postgresql" | undefined;
    database?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    sqlitePath?: string | undefined;
    poolMin?: number | undefined;
    poolMax?: number | undefined;
    connectionTimeout?: number | undefined;
    idleTimeout?: number | undefined;
    sslEnabled?: boolean | undefined;
    sslRejectUnauthorized?: boolean | undefined;
    logQueries?: boolean | undefined;
}>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
/**
 * Load database configuration from environment
 */
export declare function loadDatabaseConfig(): DatabaseConfig;
/**
 * Get database configuration (singleton)
 */
export declare function getDatabaseConfig(): DatabaseConfig;
/**
 * Build Prisma database URL from configuration
 */
export declare function buildDatabaseUrl(config?: DatabaseConfig): string;
//# sourceMappingURL=database.d.ts.map