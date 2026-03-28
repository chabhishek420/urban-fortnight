/**
 * Fastify Application Factory
 * 
 * Creates and configures the Fastify server instance.
 * 
 * @see keitaro_source/server.php (RoadRunner server setup)
 */

import Fastify, { 
  type FastifyInstance, 
  type FastifyServerOptions,
  type FastifyRequest,
  type FastifyReply
} from 'fastify';
import { pino, type Logger as PinoLogger, type LoggerOptions } from 'pino';

import type { AppConfig } from '../config/index';
import { getAppConfig, isDevelopment } from '../config/index';
import { registerRoutes } from './routes';
import { registerPlugins } from './plugins';

// Extend FastifyInstance to include config
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
  logger?: PinoLogger | boolean;
  trustProxy?: boolean;
  bodyLimit?: number;
  requestTimeout?: number;
}

/**
 * Create and configure the Fastify application
 */
export async function createApp(options: ServerOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? getAppConfig();

  // Create Fastify instance
  const fastify = Fastify({
    logger: options.logger ?? createLogger(config),
    trustProxy: options.trustProxy ?? true,
    bodyLimit: options.bodyLimit ?? config.maxRequestBodySize,
    requestTimeout: options.requestTimeout ?? config.requestTimeout,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config.logLevel.includes('debug'),
  } as FastifyServerOptions);

  // Store config reference
  fastify.decorate('config', config);

  // Register core plugins
  await registerPlugins(fastify, config);

  // Register routes
  await registerRoutes(fastify);

  // Error handler
  fastify.setErrorHandler(errorHandler);

  // 404 handler
  fastify.setNotFoundHandler(notFoundHandler);

  return fastify;
}

/**
 * Create a Pino logger
 */
function createLogger(config: AppConfig): PinoLogger {
  const options: LoggerOptions = {
    level: config.logLevel,
  };
  
  if (config.logPretty) {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }
  
  return pino(options);
}

/**
 * Global error handler
 */
function errorHandler(
  error: Error & { 
    statusCode?: number;
    validation?: unknown;
  },
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const statusCode = error.statusCode ?? 500;
  const config = request.server.config;

  // Log error
  request.log.error({
    error: {
      message: error.message,
      stack: config?.logLevel === 'debug' ? error.stack : undefined,
    },
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
    },
  });

  // Validation errors
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
    return;
  }

  // HTTP errors
  reply.status(statusCode).send({
    error: statusCode >= 500 && !isDevelopment()
      ? 'Internal Server Error' 
      : error.message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
): void {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Start the server
 */
export async function startServer(
  fastify: FastifyInstance,
  config?: AppConfig
): Promise<void> {
  const appConfig = config ?? fastify.config;

  try {
    // Start listening
    await fastify.listen({
      port: appConfig?.port ?? 3000,
      host: appConfig?.host ?? '0.0.0.0',
    });

    fastify.log.info(`Server started on ${appConfig?.host}:${appConfig?.port}`);
  } catch (error) {
    fastify.log.error(error);
    throw error;
  }
}

/**
 * Graceful shutdown
 */
export async function shutdownServer(
  fastify: FastifyInstance
): Promise<void> {
  try {
    await fastify.close();
    fastify.log.info('Server shutdown complete');
  } catch (error) {
    fastify.log.error(error, 'Error during shutdown');
    throw error;
  }
}
