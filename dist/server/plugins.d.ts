/**
 * Fastify Plugins
 *
 * Registers all Fastify plugins for the application.
 */
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config/index';
declare module 'fastify' {
    interface FastifyRequest {
        startTime?: number;
    }
}
/**
 * Register all Fastify plugins
 */
export declare function registerPlugins(fastify: FastifyInstance, config: AppConfig): Promise<void>;
//# sourceMappingURL=plugins.d.ts.map