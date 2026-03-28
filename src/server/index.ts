/**
 * Server Entry Point
 * 
 * Main entry point for the Fastify HTTP server.
 * 
 * @see keitaro_source/server.php (RoadRunner server)
 * @see keitaro_source/index.php (FPM entry)
 */

import { createApp, startServer, shutdownServer } from './app';
import { getAppConfig } from '../config/index';

// Server instance reference
let server: Awaited<ReturnType<typeof createApp>> | null = null;

/**
 * Bootstrap and start the server
 */
async function main(): Promise<void> {
  // Get configuration
  const config = getAppConfig();

  // Register shutdown handlers
  registerShutdownHandlers();

  try {
    // Create Fastify app
    server = await createApp({ config });

    // Start listening
    await startServer(server, config);

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    Keitaro Tracker                        ║
║                                                           ║
║  Environment: ${config.env.padEnd(42)}║
║  Server:      http://${config.host}:${config.port.toString().padEnd(29)}║
║  Docs:        http://${config.host}:${config.port}/docs${' '.repeat(23)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Register process signal handlers for graceful shutdown
 */
function registerShutdownHandlers(): void {
  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    try {
      // Shutdown server
      if (server) {
        await shutdownServer(server);
      }

      console.log('Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

// Run the server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Export for testing
export { createApp, startServer, shutdownServer };
