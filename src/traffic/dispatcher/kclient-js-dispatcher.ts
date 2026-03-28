/**
 * KClient JS Dispatcher
 * 
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/KClientJSDispatcher.php
 */
import { ClickApiDispatcher } from './click-api-dispatcher';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';
import type { Payload } from '../pipeline/payload';

export class KClientJSDispatcher extends ClickApiDispatcher {
  constructor(payload: Payload, version: number = 2) {
    super(payload, version);
  }

  /**
   * Dispatch and return JS client code
   */
  dispatch(request: ServerRequest): Response {
    const isNew = request.getParam('_new') === '1';
    
    // If no sub_id or new flag, generate new tracking code
    if (!request.hasParam('sub_id') || isNew) {
      return this.getCodeWithoutSubId(request);
    }
    
    // Return code with existing sub_id
    return this.getCodeWithSubId(request);
  }

  /**
   * Get code for new visitors (no sub_id)
   */
  private getCodeWithoutSubId(request: ServerRequest): Response {
    this.setVersion(3);
    
    const response = super.dispatch(request);
    
    if (!response) {
      throw new Error('Empty response');
    }
    
    if (response.getStatus() !== StatusCode.OK) {
      return response;
    }
    
    // Get data for JS client generation
    const payload = this.getPipelinePayload();
    const rawClick = payload.getRawClick();
    const subId = rawClick?.getSubId() ?? '';
    const token = (rawClick?.get('token') as string | undefined) ?? '';
    const name = request.getParam('name');
    
    // Parse response body for content
    let content: Record<string, unknown> | null = null;
    try {
      const body = response.getBody();
      if (body) {
        content = JSON.parse(body.toString()) as Record<string, unknown>;
      }
    } catch {
      // Ignore parse errors
    }
    
    // Generate JS client code
    const jsClient = this.generateClientCode(request, subId, token, content, name);
    
    return response
      .withHeader(ContentType.HEADER, ContentType.JAVASCRIPT)
      .withBody(jsClient);
  }

  /**
   * Get code for existing visitors (with sub_id)
   */
  private getCodeWithSubId(request: ServerRequest): Response {
    const subId = request.getParam('sub_id') ?? '';
    const token = request.getParam('token') ?? '';
    const name = request.getParam('name');
    
    // Generate simple JS client code
    const jsClient = this.generateClientCode(request, subId, token, '', name);
    
    return HttpResponse.build()
      .withHeader(ContentType.HEADER, ContentType.JAVASCRIPT)
      .withBody(jsClient);
  }

  /**
   * Generate JavaScript client code
   */
  private generateClientCode(
    _request: ServerRequest,
    subId: string,
    token: string,
    content: Record<string, unknown> | null | string,
    name?: string
  ): string {
    // In production: Use CodeGenerator for full implementation
    const clientName = name || 'KClient';
    
    return `
// Keitaro Tracking Client
(function() {
  var ${clientName} = {
    subId: "${subId}",
    token: "${token}",
    ${content ? `data: ${JSON.stringify(content)},` : ''}
    
    track: function(event, params) {
      // Track event
      var url = window.location.origin + '/track?sub_id=' + this.subId + '&event=' + event;
      if (params) {
        for (var key in params) {
          url += '&' + key + '=' + encodeURIComponent(params[key]);
        }
      }
      var img = new Image();
      img.src = url;
    },
    
    updateToken: function(token) {
      this.token = token;
    }
  };
  
  window.${clientName} = ${clientName};
})();
`.trim();
  }
}
