/**
 * Fastify Plugins
 * 
 * Registers all Fastify plugins for the application.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import staticPlugin from '@fastify/static';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';

import type { AppConfig } from '../config/index';

// Extend FastifyRequest to include timing
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

/**
 * Register all Fastify plugins
 */
export async function registerPlugins(
  fastify: FastifyInstance,
  config: AppConfig
): Promise<void> {
  // CORS
  if (config.corsEnabled) {
    await fastify.register(cors, {
      origin: true, // Allow all origins in development
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    });
  }

  // Cookie parser
  await fastify.register(cookie, {
    secret: config.secretKey,
    hook: 'onRequest',
  });

  // Form body parser
  await fastify.register(formbody);

  // Rate limiting
  if (config.rateLimitEnabled) {
    await fastify.register(rateLimit, {
      max: config.rateLimitMax,
      timeWindow: config.rateLimitWindow,
      keyGenerator: (request) => {
        return request.ip;
      },
      errorResponseBuilder: () => ({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        statusCode: 429,
      }),
    });
  }

  // Static file serving
  try {
    const staticPath = path.resolve(process.cwd(), config.staticPath);
    await fastify.register(staticPlugin, {
      root: staticPath,
      prefix: '/static/',
      decorateReply: true,
    });
  } catch {
    fastify.log.warn(`Static path not found: ${config.staticPath}`);
  }

  // Swagger documentation (only in development)
  if (config.env === 'development') {
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: config.appName,
          description: 'Keitaro Tracker API Documentation',
          version: config.appVersion,
        },
        servers: [
          {
            url: `http://${config.host}:${config.port}`,
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'tracking', description: 'Tracking endpoints' },
          { name: 'admin', description: 'Admin panel endpoints' },
          { name: 'api', description: 'REST API endpoints' },
        ],
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
      staticCSP: true,
    });
  }

  // Request context plugin
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    // Add timing
    request.startTime = Date.now();
  });

  // Response time header
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.startTime) {
      const duration = Date.now() - request.startTime;
      reply.header('X-Response-Time', `${duration}ms`);
    }
  });

  // Health check plugin
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            uptime: { type: 'number' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));

  // Readiness check plugin
  fastify.get('/ready', {
    schema: {
      description: 'Readiness check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            ready: { type: 'boolean' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async () => ({
    ready: true,
    timestamp: new Date().toISOString(),
  }));
}
