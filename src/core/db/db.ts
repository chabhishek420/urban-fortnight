/**
 * Database Service
 * 
 * Provides Prisma client wrapper for database operations.
 * Implements connection management and query utilities.
 * 
 * @see keitaro_source/application/Core/Db/Db.php
 */

import { PrismaClient } from '@prisma/client';

/**
 * Database configuration options
 */
export interface DatabaseConfig {
  url?: string;
  log?: boolean;
  poolSize?: number;
}

/**
 * Database connection state
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  ERROR = 'error'
}

/**
 * Database service singleton
 */
class DatabaseService {
  private static _instance: DatabaseService | null = null;
  private _client: PrismaClient | null = null;
  private _state: ConnectionState = ConnectionState.DISCONNECTED;
  private _config: DatabaseConfig = {};

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService._instance) {
      DatabaseService._instance = new DatabaseService();
    }
    return DatabaseService._instance;
  }

  /**
   * Reset singleton instance
   */
  static reset(): void {
    if (DatabaseService._instance?._client) {
      DatabaseService._instance._client.$disconnect();
    }
    DatabaseService._instance = null;
  }

  /**
   * Configure database connection
   */
  configure(config: DatabaseConfig): void {
    this._config = { ...this._config, ...config };
  }

  /**
   * Get Prisma client
   */
  get client(): PrismaClient {
    if (!this._client) {
      this._client = this.createClient();
    }
    return this._client;
  }

  /**
   * Get connection state
   */
  get state(): ConnectionState {
    return this._state;
  }

  /**
   * Create Prisma client instance
   */
  private createClient(): PrismaClient {
    const options: ConstructorParameters<typeof PrismaClient>[0] = {
      log: this._config.log 
        ? [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'error' }, { emit: 'event', level: 'warn' }]
        : [],
    };

    if (this._config.url) {
      options.datasourceUrl = this._config.url;
    }

    const client = new PrismaClient(options);

    // Set up logging
    if (this._config.log) {
      client.$on('query' as never, (e: { query: string; duration: number }) => {
        console.debug(`[DB Query] ${e.query} (${e.duration}ms)`);
      });
      client.$on('error' as never, (e: { message: string }) => {
        console.error(`[DB Error] ${e.message}`);
      });
    }

    this._state = ConnectionState.CONNECTED;
    return client;
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this._state = ConnectionState.CONNECTED;
    } catch (error) {
      this._state = ConnectionState.ERROR;
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.$disconnect();
      this._state = ConnectionState.DISCONNECTED;
    }
  }

  /**
   * Execute raw query
   */
  async rawQuery<T = unknown>(query: string, ...values: unknown[]): Promise<T> {
    return this.client.$queryRawUnsafe<T>(query, ...values);
  }

  /**
   * Execute raw command
   */
  async rawExecute(query: string, ...values: unknown[]): Promise<unknown> {
    return this.client.$executeRawUnsafe(query, ...values);
  }

  /**
   * Transaction wrapper
   */
  async transaction<T>(fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();
export const Database = DatabaseService;

export default db;
