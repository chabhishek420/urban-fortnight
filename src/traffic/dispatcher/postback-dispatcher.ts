/**
 * Postback Dispatcher
 * 
 * Handles postback/conversion tracking requests.
 * Processes conversion data from affiliate networks and advertisers.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/PostbackDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { ContentType } from '../response/content-type';

/**
 * 1x1 transparent GIF pixel
 */
const PIXEL = 'R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==';

export class PostbackDispatcher implements DispatcherInterface {
  static readonly JSONP = 'jsonp';
  static readonly GIF = 'gif';

  /**
   * Dispatch the postback request
   */
  dispatch(request: ServerRequest): Response {
    const response = new HttpResponse({
      disableCache: true
    });
    
    const key = this.findKey(request);
    const modifiedRequest = this.convertCustomHeaders(request);
    
    // Log postback
    this.log(`Received postback ${modifiedRequest.getUri().toString()}`);
    
    // Validate postback key
    if (!this.isKeyValid(key)) {
      const message = `Incorrect postback code (${key})`;
      this.log(message);
      return this.updateBody(response, message, modifiedRequest.getParam('return'));
    }
    
    try {
      // Build postback from params
      const postback = this.buildPostbackFromParams(modifiedRequest);
      
      // Try to get sub_id from cookies if not provided
      if (!postback.subId) {
        const cookieSubId = modifiedRequest.getCookie('sub_id');
        if (cookieSubId) {
          postback.subId = cookieSubId;
        }
      }
      
      if (!postback.subId) {
        this.log(`Incorrect subid "${postback.subId}". Postback ignored.`);
        return this.updateBody(response, 'Incorrect subid', modifiedRequest.getParam('return'));
      }
      
      // Process postback
      this.processPostback(postback);
      this.log(`Using "${postback.subId}" as subid. Postback added to queue.`);
      
      return this.updateBody(response, 'Success', modifiedRequest.getParam('return'));
      
    } catch (e) {
      const error = e as Error;
      this.log(error.message);
      return this.updateBody(response, error.message, modifiedRequest.getParam('return'));
    }
  }

  /**
   * Log postback message
   */
  log(message: string): void {
    // In production: PostbackLoggerService::instance()->log(message)
    console.log(`[Postback] ${message}`);
  }

  /**
   * Convert custom headers for special integrations
   */
  convertCustomHeaders(request: ServerRequest): ServerRequest {
    // In production: Parse special XML bodies for Mosbill integration
    return request;
  }

  /**
   * Find postback key from request
   */
  private findKey(request: ServerRequest): string | null {
    // Check explicit key param
    const keyParam = request.getParam('k_router_key');
    if (keyParam) {
      return keyParam;
    }
    
    // Check first query param
    const params = request.getQueryParams();
    const keys = Object.keys(params);
    if (keys.length > 0) {
      return keys[0] ?? null;
    }
    
    return null;
  }

  /**
   * Validate postback key
   */
  private isKeyValid(key: string | null): boolean {
    // In production: Compare with NetworkTemplatesRepository secret
    return !!key;
  }

  /**
   * Build postback object from request params
   */
  private buildPostbackFromParams(request: ServerRequest): { subId: string | null; [key: string]: unknown } {
    const params = request.getQueryParams();
    
    return {
      subId: params['sub_id'] ?? params['subid'] ?? null,
      sale: params['sale'] ?? params['payout'] ?? null,
      revenue: params['revenue'] ?? params['cost'] ?? null,
      ...params
    };
  }

  /**
   * Process the postback
   */
  private processPostback(postback: { subId: string | null; [key: string]: unknown }): void {
    // In production: ProcessPostbackCommand::processPostback(postback)
    this.log(`Processing postback for sub_id: ${postback.subId}`);
  }

  /**
   * Update response body based on return format
   */
  private updateBody(response: Response, message: string, returnFormat?: string): Response {
    switch (returnFormat) {
      case PostbackDispatcher.JSONP:
        const jsCode = `KTracking && KTracking.response("${this.escapeHtml(message)}")`;
        return response
          .withHeader(ContentType.HEADER, ContentType.JAVASCRIPT)
          .withBody(jsCode);
          
      case PostbackDispatcher.GIF:
        return response
          .withHeader(ContentType.HEADER, ContentType.GIF)
          .withBody(Buffer.from(PIXEL, 'base64'));
          
      default:
        return response.withBody(message);
    }
  }

  /**
   * Escape HTML entities
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
