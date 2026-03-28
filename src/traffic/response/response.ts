/**
 * HTTP Response Class
 * 
 * Represents an HTTP response with builder pattern for easy construction.
 * 
 * @see keitaro_source/application/Traffic/Response/Response.php
 */

import { StatusCode } from './status-code';
import { ContentType } from './content-type';

/**
 * Response constructor options
 */
export interface ResponseOptions {
  status?: number;
  headers?: Record<string, string | string[]>;
  body?: string | Buffer | null;
  disableCache?: boolean;
}

/**
 * Response build options
 */
export interface ResponseBuildOptions {
  status?: number;
  body?: string | Buffer | null;
  disableCache?: boolean;
}

/**
 * JSON response options
 */
export interface JsonResponseOptions {
  status?: number;
  body: unknown;
  disableCache?: boolean;
}

export class Response {
  private _status: number = StatusCode.OK;
  private _headers: Map<string, string[]> = new Map();
  private _body: string | Buffer | null = null;
  private _disableCache: boolean = false;

  constructor(options: ResponseOptions = {}) {
    if (options.status !== undefined) this._status = options.status;
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        this.withHeader(key, value);
      }
    }
    if (options.body !== undefined) this._body = options.body;
    if (options.disableCache !== undefined) this._disableCache = options.disableCache;
  }

  /**
   * Create a new response builder
   */
  static build(): Response {
    return new Response();
  }

  /**
   * Build an HTML response
   */
  static buildHtml(options: ResponseBuildOptions = {}): Response {
    const response = new Response({
      status: options.status ?? StatusCode.OK,
      body: options.body ?? '',
      disableCache: options.disableCache ?? true
    });
    
    response.withHeader(ContentType.HEADER, ContentType.HTML);
    
    if (options.disableCache !== false) {
      response.withCacheDisabled();
    }
    
    return response;
  }

  /**
   * Build a JSON response
   */
  static buildJson(options: JsonResponseOptions): Response {
    const body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
    
    const response = new Response({
      status: options.status ?? StatusCode.OK,
      body,
      disableCache: options.disableCache ?? true
    });
    
    response.withHeader(ContentType.HEADER, ContentType.JSON);
    
    return response;
  }

  /**
   * Build a redirect response
   */
  static buildRedirect(url: string, status: number = StatusCode.FOUND): Response {
    return new Response()
      .withStatus(status)
      .withHeader('Location', url);
  }

  /**
   * Build a text response
   */
  static buildText(body: string, status: number = StatusCode.OK): Response {
    return new Response({ body, status })
      .withHeader(ContentType.HEADER, ContentType.TEXT);
  }

  /**
   * Set response status
   */
  withStatus(status: number): this {
    this._status = status;
    return this;
  }

  /**
   * Set a header (replaces existing)
   */
  withHeader(name: string, value: string | string[]): this {
    this._headers.set(name, Array.isArray(value) ? value : [value]);
    return this;
  }

  /**
   * Append to a header
   */
  appendHeader(name: string, value: string): this {
    const existing = this._headers.get(name) ?? [];
    existing.push(value);
    this._headers.set(name, existing);
    return this;
  }

  /**
   * Remove a header
   */
  withoutHeader(name: string): this {
    this._headers.delete(name);
    return this;
  }

  /**
   * Set response body
   */
  withBody(body: string | Buffer | null): this {
    this._body = body;
    return this;
  }

  /**
   * Disable caching
   */
  withCacheDisabled(): this {
    this._disableCache = true;
    this.withHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    this.withHeader('Pragma', 'no-cache');
    return this;
  }

  /**
   * Get response status
   */
  getStatus(): number {
    return this._status;
  }

  /**
   * Get all headers
   */
  getHeaders(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [key, value] of this._headers) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Get a specific header
   */
  getHeader(name: string): string[] | undefined {
    return this._headers.get(name);
  }

  /**
   * Get response body
   */
  getBody(): string | Buffer | null {
    return this._body;
  }

  /**
   * Check if caching is disabled
   */
  isCacheDisabled(): boolean {
    return this._disableCache;
  }

  /**
   * Convert to string (for debugging)
   */
  toString(): string {
    return `Response(status=${this._status}, headers=${JSON.stringify(this.getHeaders())})`;
  }
}

// Re-export StatusCode and ContentType for convenience
export { StatusCode } from './status-code';
export { ContentType } from './content-type';
