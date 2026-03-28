/**
 * Fastify Application Factory
 *
 * Creates and configures the Fastify server instance.
 *
 * @see keitaro_source/server.php (RoadRunner server setup)
 */
import { type FastifyInstance } from 'fastify';
import { pino } from 'pino';
import type { AppConfig } from '../config/index';
declare module 'fastify' {
    interface FastifyInstance {
        config?: AppConfig;
    }
}
/**
 * Server options
 */
export interface ServerOptions {
    config?: AppConfig;
    logger?: pino.Logger | boolean;
    trustProxy?: boolean;
    bodyLimit?: number;
    requestTimeout?: number;
}
/**
 * Create and configure the Fastify application
 */
export declare function createApp(options?: ServerOptions): Promise<FastifyInstance>;
/**
 * Start the server
 */
export declare function startServer(fastify: FastifyInstance, config?: AppConfig): Promise<void>;
/**
 * Graceful shutdown
 */
export declare function shutdownServer(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=app.d.ts.map