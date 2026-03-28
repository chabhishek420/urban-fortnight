/**
 * Test Click API Endpoint
 * 
 * Tests the click pipeline flow end-to-end.
 * Access at: /api/test-click?campaign=test-campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { ClickDispatcher } from '@/traffic/dispatcher/click-dispatcher';
import { ServerRequest } from '@/traffic/request/server-request';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const logs: string[] = [];
  
  try {
    logs.push('🧪 Starting click pipeline test...');
    
    // Get campaign alias from query
    const campaignAlias = request.nextUrl.searchParams.get('campaign') || 'test-campaign';
    logs.push(`📋 Campaign alias: ${campaignAlias}`);
    
    // Fetch campaign from database
    const db = getDb();
    const campaign = await db.campaign.findFirst({
      where: { 
        OR: [
          { alias: campaignAlias },
          { name: campaignAlias }
        ]
      }
    });
    
    if (!campaign) {
      return NextResponse.json({
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
    const serverRequest = new ServerRequest({
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
    const dispatcher = new ClickDispatcher();
    logs.push('⚡ Created click dispatcher');
    
    // Process through dispatcher
    logs.push('🚀 Running dispatcher...');
    const response = await dispatcher.dispatch(serverRequest);
    logs.push('✅ Dispatcher completed');
    
    logs.push(`📤 Response status: ${response.getStatus()}`);
    logs.push(`📤 Response headers: ${JSON.stringify(response.getHeaders())}`);
    
    // Build response
    return NextResponse.json({
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
          if (typeof body === 'string') return body.substring(0, 500);
          if (body instanceof Buffer) return '[Buffer]';
          return null;
        })(),
      },
      logs,
      duration: Date.now() - startTime
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    
    logs.push(`❌ Error: ${errorMessage}`);
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: stack?.split('\n').slice(0, 15),
      logs,
      duration: Date.now() - startTime
    }, { status: 500 });
  }
}
