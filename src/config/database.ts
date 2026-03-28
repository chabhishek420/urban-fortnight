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
export const DatabaseProvider = {
  MYSQL: 'mysql',
  SQLITE: 'sqlite',
  POSTGRESQL: 'postgresql',
} as const;

export type DatabaseProviderType = typeof DatabaseProvider[keyof typeof DatabaseProvider];

/**
 * Database configuration schema
 */
export const DatabaseConfigSchema = z.object({
  provider: z.enum(['mysql', 'sqlite', 'postgresql']).default('sqlite'),
  
  // MySQL/PostgreSQL settings
  host: z.string().default('localhost'),
  port: z.number().int().min(1).max(65535).default(3306),
  database: z.string().default('keitaro'),
  username: z.string().default('keitaro'),
  password: z.string().default(''),
  
  // SQLite settings
  sqlitePath: z.string().default('./data/keitaro.db'),
  
  // Connection pool
  poolMin: z.number().int().min(0).default(2),
  poolMax: z.number().int().min(1).default(10),
  connectionTimeout: z.number().default(30000),
  idleTimeout: z.number().default(10000),
  
  // SSL
  sslEnabled: z.boolean().default(false),
  sslRejectUnauthorized: z.boolean().default(true),
  
  // Debug
  debug: z.boolean().default(false),
  logQueries: z.boolean().default(false),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

/**
 * Load database configuration from environment
 */
export function loadDatabaseConfig(): DatabaseConfig {
  const dbUrl = process.env.DATABASE_URL;
  
  // Parse DATABASE_URL if provided
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      const provider = url.protocol.replace(':', '') as DatabaseProviderType;
      
      return DatabaseConfigSchema.parse({
        provider: (provider as string) === 'file' || provider === 'sqlite' ? 'sqlite' : provider,
        host: url.hostname,
        port: parseInt(url.port, 10) || (provider === 'mysql' ? 3306 : 5432),
        database: url.pathname.slice(1),
        username: url.username,
        password: url.password,
        sqlitePath: (provider as string) === 'file' || provider === 'sqlite' ? url.pathname : undefined,
        
        poolMin: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
        poolMax: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '30000', 10),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT ?? '10000', 10),
        
        sslEnabled: process.env.DB_SSL === 'true',
        sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        
        debug: process.env.DB_DEBUG === 'true',
        logQueries: process.env.DB_LOG_QUERIES === 'true',
      });
    } catch {
      // Fall through to individual env vars
    }
  }
  
  return DatabaseConfigSchema.parse({
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
let dbConfig: DatabaseConfig | null = null;

/**
 * Get database configuration (singleton)
 */
export function getDatabaseConfig(): DatabaseConfig {
  if (!dbConfig) {
    dbConfig = loadDatabaseConfig();
  }
  return dbConfig;
}

/**
 * Build Prisma database URL from configuration
 */
export function buildDatabaseUrl(config: DatabaseConfig = getDatabaseConfig()): string {
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
