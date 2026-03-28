"use strict";
/**
 * Database Service
 *
 * Provides Prisma client wrapper for database operations.
 * Implements connection management and query utilities.
 *
 * @see keitaro_source/application/Core/Db/Db.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.db = exports.ConnectionState = void 0;
const client_1 = require("@prisma/client");
/**
 * Database connection state
 */
var ConnectionState;
(function (ConnectionState) {
    ConnectionState["DISCONNECTED"] = "disconnected";
    ConnectionState["CONNECTED"] = "connected";
    ConnectionState["ERROR"] = "error";
})(ConnectionState || (exports.ConnectionState = ConnectionState = {}));
/**
 * Database service singleton
 */
class DatabaseService {
    static _instance = null;
    _client = null;
    _state = ConnectionState.DISCONNECTED;
    _config = {};
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!DatabaseService._instance) {
            DatabaseService._instance = new DatabaseService();
        }
        return DatabaseService._instance;
    }
    /**
     * Reset singleton instance
     */
    static reset() {
        if (DatabaseService._instance?._client) {
            DatabaseService._instance._client.$disconnect();
        }
        DatabaseService._instance = null;
    }
    /**
     * Configure database connection
     */
    configure(config) {
        this._config = { ...this._config, ...config };
    }
    /**
     * Get Prisma client
     */
    get client() {
        if (!this._client) {
            this._client = this.createClient();
        }
        return this._client;
    }
    /**
     * Get connection state
     */
    get state() {
        return this._state;
    }
    /**
     * Create Prisma client instance
     */
    createClient() {
        const options = {
            log: this._config.log
                ? [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'error' }, { emit: 'event', level: 'warn' }]
                : [],
        };
        if (this._config.url) {
            options.datasourceUrl = this._config.url;
        }
        const client = new client_1.PrismaClient(options);
        // Set up logging
        if (this._config.log) {
            client.$on('query', (e) => {
                console.debug(`[DB Query] ${e.query} (${e.duration}ms)`);
            });
            client.$on('error', (e) => {
                console.error(`[DB Error] ${e.message}`);
            });
        }
        this._state = ConnectionState.CONNECTED;
        return client;
    }
    /**
     * Connect to database
     */
    async connect() {
        try {
            await this.client.$connect();
            this._state = ConnectionState.CONNECTED;
        }
        catch (error) {
            this._state = ConnectionState.ERROR;
            throw error;
        }
    }
    /**
     * Disconnect from database
     */
    async disconnect() {
        if (this._client) {
            await this._client.$disconnect();
            this._state = ConnectionState.DISCONNECTED;
        }
    }
    /**
     * Execute raw query
     */
    async rawQuery(query, ...values) {
        return this.client.$queryRawUnsafe(query, ...values);
    }
    /**
     * Execute raw command
     */
    async rawExecute(query, ...values) {
        return this.client.$executeRawUnsafe(query, ...values);
    }
    /**
     * Transaction wrapper
     */
    async transaction(fn) {
        return this.client.$transaction(fn);
    }
    /**
     * Health check
     */
    async healthCheck() {
        try {
            await this.client.$queryRaw `SELECT 1`;
            return true;
        }
        catch {
            return false;
        }
    }
}
// Export singleton instance
exports.db = DatabaseService.getInstance();
exports.Database = DatabaseService;
exports.default = exports.db;
//# sourceMappingURL=db.js.map