/**
 * Click Tracking API Endpoint
 * 
 * Main tracking endpoint for processing click traffic.
 * Routes through TrafficRouter and executes appropriate dispatcher.
 * 
 * URL Patterns:
 * - /click?campaign=alias - Campaign by alias
 * - /click/alias - Campaign alias in path
 * - /click?token=xxx - Campaign by token
 */

import { NextRequest, NextResponse } from 'next/server';
import { TrafficRouter } from '@/core/router/traffic-router';
import { ServerRequest } from '@/traffic/request/server-request';
import { StatusCode } from '@/traffic/response/status-code';

export async function GET(request: NextRequest) {
  try {
    // Build server request from Next.js request
    const url = new URL(request.url);
    
    const serverRequest = new ServerRequest({
      method: request.method,
      uri: url,
      headers: Object.fromEntries(request.headers.entries()),
      queryParams: Object.fromEntries(request.nextUrl.searchParams),
      serverParams: {
        REMOTE_ADDR: request.headers.get('x-real-ip') || 
                     request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     '127.0.0.1'
      },
      cookies: Object.fromEntries(
        request.cookies.getAll().map(c => [c.name, c.value])
      )
    });

    // Route the request
    const router = new TrafficRouter();
    const routerResult = router.match(serverRequest);
    
    // Get context and dispatcher
    const context = routerResult.context;
    const dispatcher = context.dispatcher(routerResult.request);
    
    if (!dispatcher) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Bootstrap context
    await context.bootstrap();
    
    // Modify request
    const modifiedRequest = context.modifyRequest(routerResult.request);

    // Process through dispatcher
    const response = await dispatcher.dispatch(modifiedRequest);
    
    // Build Next.js response
    const headers = new Headers();
    
    // Add response headers
    const responseHeaders = response.getHeaders();
    for (const [key, value] of Object.entries(responseHeaders)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          headers.append(key, v);
        }
      } else if (value) {
        headers.set(key, String(value));
      }
    }

    // Return response
    let body: BodyInit | null = null;
    const responseBody = response.getBody();
    if (typeof responseBody === 'string') {
      body = responseBody;
    } else if (responseBody && typeof responseBody === 'object' && Buffer.isBuffer(responseBody)) {
      // Handle Buffer by converting to Uint8Array
      body = new Uint8Array(responseBody);
    } else if (responseBody) {
      body = String(responseBody);
    }
    
    return new NextResponse(body, {
      status: response.getStatus() || StatusCode.OK,
      headers
    });

  } catch (error) {
    console.error('Click tracking error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Also handle POST for API tracking
export async function POST(request: NextRequest) {
  return GET(request);
}
