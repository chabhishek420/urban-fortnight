/**
 * KTRK Dispatcher (JSONP Tracking)
 * 
 * Handles JSONP-based tracking requests.
 * Returns JavaScript responses for cross-domain tracking.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/KtrkDispatcher.php
 */
import { ClickApiDispatcher } from './click-api-dispatcher';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';
import type { Payload } from '../pipeline/payload';

export class KtrkDispatcher extends ClickApiDispatcher {
  constructor(payload: Payload, version: number = 2) {
    super(payload, version);
  }

  /**
   * Dispatch and return JSONP response
   */
  dispatch(request: ServerRequest): Response {
    const response = super.dispatch(request);
    
    if (!response) {
      throw new Error('Empty response');
    }
    
    // Only modify successful responses
    if (response.getStatus() !== StatusCode.OK) {
      return response;
    }
    
    // Get raw click data for JSONP response
    const rawClick = this.getPipelinePayload().getRawClick();
    
    const jsonData = {
      sub_id: rawClick?.getSubId() ?? '',
      token: rawClick?.get('token') ?? ''
    };
    
    const json = JSON.stringify(jsonData);
    const jsCode = `KTracking.response(${json});`;
    
    return response
      .withHeader(ContentType.HEADER, ContentType.JAVASCRIPT)
      .withBody(jsCode);
  }
}
