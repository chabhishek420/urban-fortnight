"use strict";
/**
 * Test Click API Endpoint
 *
 * Tests the click pipeline flow end-to-end.
 * Access at: /api/test-click?campaign=test-campaign
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const click_dispatcher_1 = require("@/traffic/dispatcher/click-dispatcher");
const server_request_1 = require("@/traffic/request/server-request");
const db_1 = require("@/lib/db");
async function GET(request) {
    const startTime = Date.now();
    const logs = [];
    try {
        logs.push('🧪 Starting click pipeline test...');
        // Get campaign alias from query
        const campaignAlias = request.nextUrl.searchParams.get('campaign') || 'test-campaign';
        logs.push(`📋 Campaign alias: ${campaignAlias}`);
        // Fetch campaign from database
        const db = (0, db_1.getDb)();
        const campaign = await db.campaign.findFirst({
            where: {
                OR: [
                    { alias: campaignAlias },
                    { name: campaignAlias }
                ]
            }
        });
        if (!campaign) {
            return server_1.NextResponse.json({
                success: false,
                error: 'Campaign not found',
                logs,
                duration: Date.now() - startTime
            }, { status: 404 });
        }
        logs.push(`✅ Found campaign: ${campaign.name} (ID: ${campaign.id})`);
        // Fetch streams for campaign
        const streams = await db.stream.findMany({
            where: { campaignId: campaign.id, state: 'active' }
        });
        logs.push(`📊 Found ${streams.length} active streams`);
        // Build server request
        const serverRequest = new server_request_1.ServerRequest({
            method: 'GET',
            uri: new URL(request.url),
            headers: {
                'User-Agent': request.headers.get('user-agent') || 'TestBot/1.0',
                'X-Real-IP': '127.0.0.1',
                'Referer': request.headers.get('referer') || '',
                'Host': 'tracker.test',
            },
            queryParams: Object.fromEntries(request.nextUrl.searchParams),
            serverParams: { REMOTE_ADDR: '127.0.0.1' },
            cookies: {}
        });
        logs.push('📨 Built server request');
        // Create dispatcher
        const dispatcher = new click_dispatcher_1.ClickDispatcher();
        logs.push('⚡ Created click dispatcher');
        // Process through dispatcher
        logs.push('🚀 Running dispatcher...');
        const response = await dispatcher.dispatch(serverRequest);
        logs.push('✅ Dispatcher completed');
        logs.push(`📤 Response status: ${response.getStatus()}`);
        logs.push(`📤 Response headers: ${JSON.stringify(response.getHeaders())}`);
        // Build response
        return server_1.NextResponse.json({
            success: true,
            campaign: {
                id: campaign.id,
                name: campaign.name,
                alias: campaign.alias,
                actionType: campaign.actionType,
            },
            streams: streams.map(s => ({
                id: s.id,
                name: s.name,
                actionType: s.actionType,
            })),
            response: {
                status: response.getStatus(),
                headers: response.getHeaders(),
                body: (() => {
                    const body = response.getBody();
                    if (typeof body === 'string')
                        return body.substring(0, 500);
                    if (body instanceof Buffer)
                        return '[Buffer]';
                    return null;
                })(),
            },
            logs,
            duration: Date.now() - startTime
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        logs.push(`❌ Error: ${errorMessage}`);
        return server_1.NextResponse.json({
            success: false,
            error: errorMessage,
            stack: stack?.split('\n').slice(0, 15),
            logs,
            duration: Date.now() - startTime
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map