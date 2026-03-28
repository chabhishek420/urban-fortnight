"use strict";
/**
 * Server Entry Point
 *
 * Main entry point for the Fastify HTTP server.
 *
 * @see keitaro_source/server.php (RoadRunner server)
 * @see keitaro_source/index.php (FPM entry)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownServer = exports.startServer = exports.createApp = void 0;
const app_1 = require("./app");
Object.defineProperty(exports, "createApp", { enumerable: true, get: function () { return app_1.createApp; } });
Object.defineProperty(exports, "startServer", { enumerable: true, get: function () { return app_1.startServer; } });
Object.defineProperty(exports, "shutdownServer", { enumerable: true, get: function () { return app_1.shutdownServer; } });
const index_1 = require("../config/index");
// Server instance reference
let server = null;
/**
 * Bootstrap and start the server
 */
async function main() {
    // Get configuration
    const config = (0, index_1.getAppConfig)();
    // Register shutdown handlers
    registerShutdownHandlers();
    try {
        // Create Fastify app
        server = await (0, app_1.createApp)({ config });
        // Start listening
        await (0, app_1.startServer)(server, config);
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
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
/**
 * Register process signal handlers for graceful shutdown
 */
function registerShutdownHandlers() {
    let isShuttingDown = false;
    const gracefulShutdown = async (signal) => {
        if (isShuttingDown) {
            return;
        }
        isShuttingDown = true;
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        try {
            // Shutdown server
            if (server) {
                await (0, app_1.shutdownServer)(server);
            }
            console.log('Graceful shutdown complete');
            process.exit(0);
        }
        catch (error) {
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
//# sourceMappingURL=index.js.map