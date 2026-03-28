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
export declare enum ConnectionState {
    DISCONNECTED = "disconnected",
    CONNECTED = "connected",
    ERROR = "error"
}
/**
 * Database service singleton
 */
declare class DatabaseService {
    private static _instance;
    private _client;
    private _state;
    private _config;
    /**
     * Get singleton instance
     */
    static getInstance(): DatabaseService;
    /**
     * Reset singleton instance
     */
    static reset(): void;
    /**
     * Configure database connection
     */
    configure(config: DatabaseConfig): void;
    /**
     * Get Prisma client
     */
    get client(): PrismaClient;
    /**
     * Get connection state
     */
    get state(): ConnectionState;
    /**
     * Create Prisma client instance
     */
    private createClient;
    /**
     * Connect to database
     */
    connect(): Promise<void>;
    /**
     * Disconnect from database
     */
    disconnect(): Promise<void>;
    /**
     * Execute raw query
     */
    rawQuery<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
    /**
     * Execute raw command
     */
    rawExecute(query: string, ...values: unknown[]): Promise<unknown>;
    /**
     * Transaction wrapper
     */
    transaction<T>(fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T>;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
}
export declare const db: DatabaseService;
export declare const Database: typeof DatabaseService;
export default db;
//# sourceMappingURL=db.d.ts.map