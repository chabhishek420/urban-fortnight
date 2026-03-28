"use strict";
/**
 * Fastify Routes
 *
 * Registers all application routes.
 *
 * @see keitaro_source/application/Core/Router/TrafficRouter.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
exports.buildServerRequest = buildServerRequest;
exports.sendResponse = sendResponse;
const server_request_1 = require("../traffic/request/server-request");
/**
 * Register all routes
 */
async function registerRoutes(fastify) {
    // API routes prefix
    fastify.register(async (api) => {
        // API version 1
        api.register(async (v1) => {
            registerApiV1Routes(v1);
        }, { prefix: '/v1' });
        // Legacy API routes (no version prefix)
        registerApiV1Routes(api);
    }, { prefix: '/api' });
    // Admin routes
    fastify.register(async (admin) => {
        registerAdminRoutes(admin);
    }, { prefix: '/admin' });
    // Gateway routes (for tracking redirects)
    fastify.register(async (gateway) => {
        registerGatewayRoutes(gateway);
    }, { prefix: '/gateway' });
    // Traffic tracking routes (index, campaign aliases)
    registerTrackingRoutes(fastify);
}
/**
 * API v1 routes
 */
function registerApiV1Routes(fastify) {
    // Campaigns
    fastify.get('/campaigns', async (_request, reply) => {
        // TODO: Implement campaign listing
        return reply.send({ campaigns: [] });
    });
    fastify.get('/campaigns/:id', async (request, reply) => {
        const { id } = request.params;
        // TODO: Implement campaign detail
        return reply.send({ campaign: { id } });
    });
    fastify.post('/campaigns', async (_request, reply) => {
        // TODO: Implement campaign creation
        return reply.code(201).send({ campaign: {} });
    });
    fastify.put('/campaigns/:id', async (request, reply) => {
        const { id } = request.params;
        // TODO: Implement campaign update
        return reply.send({ campaign: { id } });
    });
    fastify.delete('/campaigns/:id', async (_request, reply) => {
        // TODO: Implement campaign deletion
        return reply.code(204).send();
    });
    // Offers
    fastify.get('/offers', async (_request, reply) => {
        return reply.send({ offers: [] });
    });
    fastify.get('/offers/:id', async (request, reply) => {
        const { id } = request.params;
        return reply.send({ offer: { id } });
    });
    fastify.post('/offers', async (_request, reply) => {
        return reply.code(201).send({ offer: {} });
    });
    // Clicks
    fastify.get('/clicks', async (_request, reply) => {
        return reply.send({ clicks: [] });
    });
    fastify.get('/clicks/:id', async (request, reply) => {
        const { id } = request.params;
        return reply.send({ click: { id } });
    });
    // Conversions
    fastify.post('/conversions', async (_request, reply) => {
        // TODO: Implement conversion postback
        return reply.code(201).send({ conversion: {} });
    });
    // Stats
    fastify.get('/stats', async (_request, reply) => {
        return reply.send({
            stats: {
                clicks: 0,
                uniqueClicks: 0,
                conversions: 0,
                revenue: 0,
                cost: 0,
                profit: 0,
            },
        });
    });
}
/**
 * Admin routes
 */
function registerAdminRoutes(fastify) {
    // Login page
    fastify.get('/login', async (_request, reply) => {
        return reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head><title>Keitaro Admin - Login</title></head>
        <body>
          <h1>Keitaro Admin Panel</h1>
          <p>Login page placeholder</p>
        </body>
      </html>
    `);
    });
    // Dashboard
    fastify.get('/', async (_request, reply) => {
        return reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head><title>Keitaro Admin</title></head>
        <body>
          <h1>Keitaro Admin Panel</h1>
          <p>Dashboard placeholder</p>
        </body>
      </html>
    `);
    });
    // API endpoints for admin
    fastify.get('/api/stats', async (_request, reply) => {
        return reply.send({
            dashboard: {
                totalCampaigns: 0,
                activeCampaigns: 0,
                totalClicks: 0,
                todayClicks: 0,
                totalConversions: 0,
                todayConversions: 0,
                revenue: 0,
                cost: 0,
                profit: 0,
            },
        });
    });
}
/**
 * Gateway routes (for tracking redirects)
 */
function registerGatewayRoutes(fastify) {
    // Redirect gateway
    fastify.get('/:code', async (request, reply) => {
        const { code } = request.params;
        // TODO: Implement gateway redirect logic
        // This should:
        // 1. Look up the code in the database
        // 2. Find the associated offer/landing
        // 3. Redirect with tracking
        return reply.redirect(`https://example.com?code=${code}`);
    });
    // Postback gateway
    fastify.get('/postback', async (request, reply) => {
        const query = request.query;
        // TODO: Implement postback handling
        return reply.send({
            status: 'ok',
            postback: query,
        });
    });
    fastify.post('/postback', async (request, reply) => {
        const body = request.body;
        // TODO: Implement postback handling
        return reply.send({
            status: 'ok',
            postback: body,
        });
    });
}
/**
 * Traffic tracking routes
 */
function registerTrackingRoutes(fastify) {
    // Main index route
    fastify.get('/', async (_request, reply) => {
        // For now, serve a simple landing page
        return reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head><title>Keitaro Tracker</title></head>
        <body>
          <h1>Keitaro Tracker</h1>
          <p>Tracking system is running.</p>
        </body>
      </html>
    `);
    });
    // Campaign route (catch-all for campaign aliases)
    fastify.get('/:alias', {
        constraints: { host: '*' },
        config: {
            // Allow this route to be overridden
            rateLimit: false,
        },
    }, async (request, reply) => {
        const { alias } = request.params;
        // Skip if this is a reserved route
        if (['api', 'admin', 'gateway', 'health', 'ready', 'docs', 'static'].includes(alias)) {
            return reply.callNotFound();
        }
        // TODO: Implement campaign routing
        // 1. Look up campaign by alias
        // 2. Process the click
        // 3. Execute campaign flow (filters, streams, offers)
        // 4. Return appropriate response
        return reply.send({
            campaign: alias,
            message: 'Campaign routing not yet implemented',
        });
    });
    // Click pixel (for pixel tracking)
    fastify.get('/pixel/:campaignId', async (_request, reply) => {
        // Return a 1x1 transparent GIF
        const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        return reply
            .type('image/gif')
            .header('Cache-Control', 'no-store, no-cache, must-revalidate')
            .header('Pragma', 'no-cache')
            .send(pixel);
    });
    // Impression tracking
    fastify.post('/impression', async (_request, reply) => {
        // TODO: Implement impression tracking
        return reply.send({ status: 'ok' });
    });
    // Click tracking
    fastify.post('/click', async (_request, reply) => {
        // TODO: Implement click tracking
        return reply.code(201).send({ clickId: 'pending' });
    });
}
/**
 * Build a ServerRequest from Fastify request
 */
function buildServerRequest(request) {
    const url = new URL(request.url, `${request.protocol}://${request.hostname}`);
    return server_request_1.ServerRequest.build({
        method: request.method,
        uri: url,
        headers: request.headers,
        queryParams: request.query,
        body: request.body,
        cookies: request.cookies,
        serverParams: {
            REMOTE_ADDR: request.ip,
            SERVER_PROTOCOL: `HTTP/${request.raw.httpVersion}`,
        },
    });
}
/**
 * Convert Response object to Fastify reply
 */
function sendResponse(reply, response) {
    // Set status
    reply.status(response.getStatus());
    // Set headers
    const headers = response.getHeaders();
    for (const [name, values] of Object.entries(headers)) {
        for (const value of values) {
            reply.header(name, value);
        }
    }
    // Send body
    const body = response.getBody();
    if (body === null) {
        return reply.send();
    }
    return reply.send(body);
}
//# sourceMappingURL=routes.js.map