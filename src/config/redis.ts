/**
 * Redis Configuration
 * 
 * Redis connection settings for caching and session management.
 * 
 * @see keitaro_source/application/Core/Cache/RedisCache.php
 */

import { z } from 'zod';

/**
 * Redis configuration schema
 */
export const RedisConfigSchema = z.object({
  enabled: z.boolean().default(false),
  
  // Connection
  host: z.string().default('localhost'),
  port: z.number().int().min(1).max(65535).default(6379),
  password: z.string().optional(),
  username: z.string().optional(),
  database: z.number().int().min(0).max(15).default(0),
  
  // Connection pool
  maxConnections: z.number().int().min(1).default(50),
  minConnections: z.number().int().min(0).default(5),
  
  // Timeouts
  connectTimeout: z.number().default(10000),
  commandTimeout: z.number().default(5000),
  keepAlive: z.number().default(30000),
  
  // Retry
  retryAttempts: z.number().default(3),
  retryDelay: z.number().default(100),
  
  // TLS
  tlsEnabled: z.boolean().default(false),
  
  // Keys prefix
  keyPrefix: z.string().default('keitaro:'),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;

/**
 * Load Redis configuration from environment
 */
export function loadRedisConfig(): RedisConfig {
  const redisUrl = process.env.REDIS_URL;
  
  // Parse REDIS_URL if provided
  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      
      return RedisConfigSchema.parse({
        enabled: true,
        host: url.hostname,
        port: parseInt(url.port, 10) || 6379,
        password: url.password || undefined,
        username: url.username || undefined,
        database: parseInt(url.pathname.slice(1), 10) || 0,
        
        maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS ?? '50', 10),
        minConnections: parseInt(process.env.REDIS_MIN_CONNECTIONS ?? '5', 10),
        
        connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT ?? '10000', 10),
        commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT ?? '5000', 10),
        keepAlive: parseInt(process.env.REDIS_KEEPALIVE ?? '30000', 10),
        
        retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS ?? '3', 10),
        retryDelay: parseInt(process.env.REDIS_RETRY_DELAY ?? '100', 10),
        
        tlsEnabled: process.env.REDIS_TLS === 'true',
        
        keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'keitaro:',
      });
    } catch {
      // Fall through to individual env vars
    }
  }
  
  return RedisConfigSchema.parse({
    enabled: process.env.REDIS_ENABLED === 'true',
    
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    database: parseInt(process.env.REDIS_DATABASE ?? '0', 10),
    
    maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS ?? '50', 10),
    minConnections: parseInt(process.env.REDIS_MIN_CONNECTIONS ?? '5', 10),
    
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT ?? '10000', 10),
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT ?? '5000', 10),
    keepAlive: parseInt(process.env.REDIS_KEEPALIVE ?? '30000', 10),
    
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS ?? '3', 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY ?? '100', 10),
    
    tlsEnabled: process.env.REDIS_TLS === 'true',
    
    keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'keitaro:',
  });
}

/**
 * Redis configuration singleton
 */
let redisConfig: RedisConfig | null = null;

/**
 * Get Redis configuration (singleton)
 */
export function getRedisConfig(): RedisConfig {
  if (!redisConfig) {
    redisConfig = loadRedisConfig();
  }
  return redisConfig;
}
