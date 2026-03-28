/**
 * Traffic Actions - Abstract Action Base Class
 * 
 * Base class for all stream action implementations.
 * Actions determine how to respond to clicks (redirects, iframes, HTML, etc.)
 * 
 * @see keitaro_source/application/Traffic/Actions/AbstractAction.php
 */

import type { Payload } from '../pipeline/payload';
import type { Response } from '../response/response';
import type { ServerRequest } from '../request/server-request';
import type { RawClick } from '../model/raw-click';
import type { Campaign } from '../model/campaign';
import type { BaseStream } from '../model/base-stream';
import type { Offer } from '../model/offer';
import type { Landing } from '../model/landing';
import { ContentType } from '../response/content-type';

/**
 * Action field types
 */
export enum ActionField {
  URL = 'url',
  TEXT = 'text',
  CAMPAIGNS = 'campaigns',
  STREAMS = 'streams',
  NOTHING = 'nothing',
  UPLOAD = 'upload'
}

/**
 * Action type categories
 */
export enum ActionType {
  REDIRECT = 'redirect',
  OTHER = 'other',
  HIDDEN = 'hidden'
}

/**
 * Action options interface
 */
export interface ActionOptions {
  headers?: Record<string, string>;
  status?: number;
  content?: string;
}

/**
 * Abstract Action Base Class
 */
export abstract class AbstractAction {
  protected _name: string;
  protected _weight: number = 1;
  protected _payload: Payload | null = null;

  constructor(name: string) {
    this._name = name;
  }

  /**
   * Get action type (redirect, other, hidden)
   */
  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  /**
   * Get field type for this action
   */
  getField(): ActionField {
    return ActionField.URL;
  }

  /**
   * Get action name
   */
  getName(): string {
    return this._name;
  }

  /**
   * Get action weight (for ordering)
   */
  getWeight(): number {
    return this._weight;
  }

  /**
   * Set pipeline payload
   */
  setPayload(payload: Payload): void {
    this._payload = payload;
  }

  /**
   * Get pipeline payload
   */
  getPayload(): Payload {
    if (!this._payload) {
      throw new Error('Payload not set');
    }
    return this._payload;
  }

  /**
   * Get response from payload
   */
  getResponse(): Response {
    const response = this.getPayload().getResponse();
    if (!response) {
      throw new Error('Response not set');
    }
    return response;
  }

  /**
   * Set response on payload
   */
  setResponse(response: Response): void {
    this.getPayload().setResponse(response);
  }

  /**
   * Get raw click from payload
   */
  getRawClick(): RawClick {
    const click = this.getPayload().getRawClick();
    if (!click) {
      throw new Error('RawClick not set');
    }
    return click;
  }

  /**
   * Get campaign from payload
   */
  getCampaign(): Campaign | undefined {
    return this.getPayload().getCampaign() ?? undefined;
  }

  /**
   * Get stream from payload
   */
  getStream(): BaseStream | undefined {
    return this.getPayload().getStream() ?? undefined;
  }

  /**
   * Get landing from payload
   */
  getLanding(): Landing | undefined {
    return this.getPayload().getLanding() ?? undefined;
  }

  /**
   * Get offer from payload
   */
  getOffer(): Offer | undefined {
    return this.getPayload().getOffer() ?? undefined;
  }

  /**
   * Get server request from payload
   */
  getServerRequest(): ServerRequest {
    return this.getPayload().getServerRequest();
  }

  /**
   * Get raw action payload (before macro processing)
   */
  getRawActionPayload(): string {
    const payload = this.getPayload().getActionPayload();
    return typeof payload === 'string' ? payload : '';
  }

  /**
   * Get action payload with macros processed
   */
  getActionPayload(): string {
    return this.processMacros(this.getRawActionPayload());
  }

  /**
   * Get action options
   */
  getActionOptions(): ActionOptions {
    const options = this.getPayload().getActionOptions();
    return options ?? {};
  }

  /**
   * Execute the action - must be implemented by subclasses
   */
  abstract execute(): void;

  /**
   * Run the action and return modified payload
   */
  run(): Payload {
    this.execute();
    return this.getPayload();
  }

  /**
   * Set response status code
   */
  setStatus(status: number): void {
    this.setResponse(this.getResponse().withStatus(status));
  }

  /**
   * Set response header
   */
  setHeader(name: string, value: string): void {
    this.setResponse(this.getResponse().withHeader(name, value));
  }

  /**
   * Add header from string (e.g., "Content-Type: text/html")
   */
  addHeader(headerString: string): void {
    const parts = headerString.split(':');
    if (parts.length < 2) {
      throw new Error('Header must contain ":"');
    }
    const name = parts[0]?.trim() ?? '';
    const value = parts.slice(1).join(':').trim();
    this.setHeader(name, value);
  }

  /**
   * Set response content type
   */
  setContentType(contentType: string): void {
    this.setHeader(ContentType.HEADER, contentType);
  }

  /**
   * Set response body content
   */
  setContent(content: string): void {
    this.setResponse(this.getResponse().withBody(content));
  }

  /**
   * Set redirect location header
   */
  redirect(url: string): void {
    this.setHeader('Location', url);
    const response = this.getResponse();
    if (response.getStatus() === 200) {
      this.setStatus(302);
    }
  }

  /**
   * Set destination info on click
   */
  setDestinationInfo(value: string): void {
    this.getRawClick().setDestination(value);
  }

  /**
   * Process macros in content
   */
  protected processMacros(content: string): string {
    // Basic macro substitution - can be extended
    const rawClick = this.getRawClick();
    const campaign = this.getCampaign();
    
    let result = content;
    
    // Click macros
    result = result.replace(/{clickid}/gi, rawClick.getSubId() || '');
    result = result.replace(/{subid}/gi, rawClick.getSubId() || '');
    
    // Campaign macros
    if (campaign) {
      result = result.replace(/{campaign_id}/gi, String(campaign.getId() ?? ''));
      result = result.replace(/{campaign_name}/gi, campaign.getName() ?? '');
    }
    
    // IP and geo
    result = result.replace(/{ip}/gi, rawClick.getIp() ?? '');
    result = result.replace(/{country}/gi, rawClick.getCountry() ?? '');
    result = result.replace(/{city}/gi, rawClick.getCity() ?? '');
    result = result.replace(/{region}/gi, rawClick.getRegion() ?? '');
    
    // Device
    result = result.replace(/{device_type}/gi, rawClick.getDeviceType() ?? '');
    result = result.replace(/{browser}/gi, rawClick.getBrowser() ?? '');
    result = result.replace(/{os}/gi, rawClick.getOs() ?? '');
    
    // Other
    result = result.replace(/{keyword}/gi, rawClick.getKeyword() ?? '');
    result = result.replace(/{referrer}/gi, rawClick.getReferrer() ?? '');
    
    return result;
  }

  /**
   * Execute in different contexts (default, script, frame)
   */
  protected executeInContext(): void {
    const queryParams = this.getServerRequest().getQueryParams();
    
    for (const [paramName, paramValue] of Object.entries(queryParams)) {
      if (paramName.startsWith('frm')) {
        const from = paramValue as string;
        if (from.startsWith('script')) {
          if (from.startsWith('frame')) {
            this.executeDefault();
          } else {
            this.executeForFrame();
          }
        } else {
          this.executeForScript();
        }
        return;
      }
    }
    
    this.executeDefault();
  }

  /**
   * Execute for script context
   */
  protected executeForScript(): void {
    this.setContentType('application/javascript');
    this.setContent('console.error("Action incompatible with script context");');
  }

  /**
   * Execute for frame context
   */
  protected executeForFrame(): void {
    this.setContentType('text/html');
    this.setContent('<script>console.error("Action incompatible with frame context");</script>');
  }

  /**
   * Execute default - must be implemented by subclasses
   */
  protected executeDefault(): void {
    this.setContent(`Error: executeDefault() must be implemented in ${this._name}`);
  }
}
