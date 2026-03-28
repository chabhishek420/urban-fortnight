/**
 * Click API Dispatcher
 * 
 * Handles API-based click processing with version support.
 * Returns JSON responses based on API version.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/ClickApiDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';
import { ContentType } from '../response/content-type';
import type { Payload } from '../pipeline/payload';

export class ClickApiDispatcher implements DispatcherInterface {
  private _version: number;
  private _pipelinePayload: Payload;

  constructor(payload: Payload, version: number = 1) {
    this._pipelinePayload = payload;
    this._version = version;
  }

  /**
   * Set API version
   */
  setVersion(version: number): void {
    this._version = version;
  }

  /**
   * Get pipeline payload
   */
  getPipelinePayload(): Payload {
    return this._pipelinePayload;
  }

  /**
   * Dispatch the API request
   */
  dispatch(request: ServerRequest): Response {
    const payload = this.getPipelinePayload();
    payload.setResponse(HttpResponse.build());
    
    try {
      // In production: Run pipeline stages
      // const pipeline = new Pipeline();
      // pipeline.firstLevelStages();
      // pipelinePayload = pipeline.start(pipelinePayload, logEntry);
      
      // Generate response based on version
      switch (this._version) {
        case 1:
          return this.buildVersion1Response(payload, request);
        case 2:
          return this.buildVersion2Response(payload, request);
        case 3:
          return this.buildVersion3Response(payload, request);
        default:
          return this.buildErrorResponse(403, `Unimplemented API version: ${this._version}`);
      }
    } catch (e) {
      const error = e as Error;
      return this.buildErrorResponse(500, error.message);
    }
  }

  /**
   * Build version 1 response
   */
  private buildVersion1Response(payload: Payload, _request: ServerRequest): Response {
    const json: Record<string, unknown> = {};
    
    const stream = payload.getStream();
    if (stream) {
      json['stream'] = {
        id: stream.getId?.() ?? null,
        url: payload.getActionPayload(),
        type: payload.getActionType(),
        campaign_id: payload.getCampaign()?.getId?.() ?? null
      };
    }
    
    const response = payload.getResponse();
    if (response) {
      const filteredHeaders = { ...response.getHeaders() };
      delete filteredHeaders['Set-Cookie'];
      delete filteredHeaders[ContentType.HEADER];
      
      json['redirect'] = {
        headers: this.headersToList(filteredHeaders),
        content: response.getBody()?.toString() ?? ''
      };
    }
    
    return HttpResponse.buildJson({
      status: StatusCode.OK,
      body: json
    });
  }

  /**
   * Build version 2 response
   */
  private buildVersion2Response(payload: Payload, _request: ServerRequest): Response {
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();
    
    const contentType = response?.getHeader(ContentType.HEADER)?.[0] ?? '';
    const filteredHeaders = response ? { ...response.getHeaders() } : {};
    delete filteredHeaders['Set-Cookie'];
    delete filteredHeaders[ContentType.HEADER];
    
    const rawClick = payload.getRawClick();
    
    const json: Record<string, unknown> = {
      body: response?.getBody()?.toString() ?? '',
      headers: this.headersToList(filteredHeaders),
      status: response?.getStatus() ?? StatusCode.OK,
      contentType,
      uniqueness_cookie: serverRequest.getCookie('keitaro_visitor') ?? ''
    };
    
    // Add info if requested
    if (serverRequest.getParam('info')) {
      json['info'] = {
        type: payload.getActionType(),
        url: payload.getActionPayload(),
        campaign_id: rawClick?.getCampaignId() ?? null,
        stream_id: rawClick?.getStreamId() ?? null,
        landing_id: rawClick?.getLandingId() ?? null,
        sub_id: rawClick?.getSubId() ?? '',
        is_bot: rawClick?.isBot() ?? false,
        offer_id: rawClick?.getOfferId() ?? null,
        token: rawClick?.get('token') ?? '',
        uniqueness: {
          campaign: rawClick?.isUniqueCampaign() ?? false,
          stream: rawClick?.isUniqueStream() ?? false,
          global: rawClick?.isUniqueGlobal() ?? false
        }
      };
    }
    
    return HttpResponse.buildJson({
      status: StatusCode.OK,
      body: json
    });
  }

  /**
   * Build version 3 response
   */
  private buildVersion3Response(payload: Payload, request: ServerRequest): Response {
    const serverRequest = payload.getServerRequest();
    const json = this.buildVersion2Json(payload, request);
    
    const campaign = payload.getCampaign();
    if (campaign) {
      json['cookies_ttl'] = campaign.getCookiesTtl();
    }
    
    json['cookies'] = serverRequest.getCookies();
    
    // Include log if requested
    if (serverRequest.getParam('log')) {
      json['log'] = ''; // In production: logEntry.flush()
    }
    
    return HttpResponse.buildJson({
      status: StatusCode.OK,
      body: json
    });
  }

  /**
   * Build version 2 JSON data (helper for v3)
   */
  private buildVersion2Json(payload: Payload, _request: ServerRequest): Record<string, unknown> {
    const serverRequest = payload.getServerRequest();
    const response = payload.getResponse();
    
    const contentType = response?.getHeader(ContentType.HEADER)?.[0] ?? '';
    const filteredHeaders = response ? { ...response.getHeaders() } : {};
    delete filteredHeaders['Set-Cookie'];
    delete filteredHeaders[ContentType.HEADER];
    
    const rawClick = payload.getRawClick();
    
    const json: Record<string, unknown> = {
      body: response?.getBody()?.toString() ?? '',
      headers: this.headersToList(filteredHeaders),
      status: response?.getStatus() ?? StatusCode.OK,
      contentType,
      uniqueness_cookie: serverRequest.getCookie('keitaro_visitor') ?? ''
    };
    
    if (serverRequest.getParam('info')) {
      json['info'] = {
        type: payload.getActionType(),
        url: payload.getActionPayload(),
        campaign_id: rawClick?.getCampaignId() ?? null,
        stream_id: rawClick?.getStreamId() ?? null,
        landing_id: rawClick?.getLandingId() ?? null,
        sub_id: rawClick?.getSubId() ?? '',
        is_bot: rawClick?.isBot() ?? false,
        offer_id: rawClick?.getOfferId() ?? null,
        token: rawClick?.get('token') ?? '',
        uniqueness: {
          campaign: rawClick?.isUniqueCampaign() ?? false,
          stream: rawClick?.isUniqueStream() ?? false,
          global: rawClick?.isUniqueGlobal() ?? false
        }
      };
    }
    
    return json;
  }

  /**
   * Convert headers to list format
   */
  private headersToList(headers: Record<string, string[]>): Array<[string, string]> {
    const result: Array<[string, string]> = [];
    for (const [name, values] of Object.entries(headers)) {
      for (const value of values) {
        result.push([name, value]);
      }
    }
    return result;
  }

  /**
   * Build error response
   */
  private buildErrorResponse(status: number, error: string): Response {
    return HttpResponse.buildJson({
      status,
      body: { error }
    });
  }

}
