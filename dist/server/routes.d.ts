/**
 * Fastify Routes
 *
 * Registers all application routes.
 *
 * @see keitaro_source/application/Core/Router/TrafficRouter.php
 */
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ServerRequest } from '../traffic/request/server-request';
import { Response } from '../traffic/response/response';
/**
 * Register all routes
 */
export declare function registerRoutes(fastify: FastifyInstance): Promise<void>;
/**
 * Build a ServerRequest from Fastify request
 */
export declare function buildServerRequest(request: FastifyRequest): ServerRequest;
/**
 * Convert Response object to Fastify reply
 */
export declare function sendResponse(reply: FastifyReply, response: Response): FastifyReply;
//# sourceMappingURL=routes.d.ts.map