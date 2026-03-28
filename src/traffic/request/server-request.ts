/**
 * Server Request Class
 * 
 * Represents an HTTP request with all relevant information.
 * 
 * @see keitaro_source/application/Traffic/Request/ServerRequest.php
 */
export class ServerRequest {
  private _method: string;
  private _uri: URL;
  private _headers: Map<string, string>;
  private _queryParams: Record<string, string>;
  private _body: unknown;
  private _cookies: Record<string, string>;
  private _serverParams: Record<string, unknown>;
  private _attributes: Map<string, unknown>;

  // Header constants
  static readonly HEADER_X_REAL_IP = 'X-Real-IP';
  static readonly HEADER_X_FORWARDED_FOR = 'X-Forwarded-For';
  static readonly HEADER_CF_CONNECTING_IP = 'CF-Connecting-IP';
  static readonly HEADER_CF_IPCOUNTRY = 'CF-IPCountry';
  static readonly HEADER_USER_AGENT = 'User-Agent';
  static readonly HEADER_REFERER = 'Referer';
  static readonly HEADER_HOST = 'Host';
  static readonly HEADER_CONTENT_TYPE = 'Content-Type';
  static readonly REMOTE_ADDR = 'REMOTE_ADDR';

  constructor(options: ServerRequestOptions = {}) {
    this._method = options.method ?? 'GET';
    this._uri = options.uri ?? new URL('http://localhost/');
    this._headers = new Map(Object.entries(options.headers ?? {}));
    this._queryParams = options.queryParams ?? {};
    this._body = options.body;
    this._cookies = options.cookies ?? {};
    this._serverParams = options.serverParams ?? {};
    this._attributes = new Map(Object.entries(options.attributes ?? {}));
  }

  /**
   * Build from Node.js IncomingMessage-like object
   */
  static build(options: ServerRequestOptions = {}): ServerRequest {
    return new ServerRequest(options);
  }

  /**
   * Get HTTP method
   */
  getMethod(): string {
    return this._method;
  }

  /**
   * Get request URI
   */
  getUri(): URL {
    return this._uri;
  }

  /**
   * Get request path
   */
  getPath(): string {
    return this._uri.pathname;
  }

  /**
   * Get a query parameter
   */
  getParam(name: string): string | undefined {
    return this._queryParams[name] ?? this._uri.searchParams.get(name) ?? undefined;
  }

  /**
   * Check if query parameter exists
   */
  hasParam(name: string): boolean {
    return name in this._queryParams || this._uri.searchParams.has(name);
  }

  /**
   * Get all query parameters
   */
  getQueryParams(): Record<string, string> {
    return { ...this._queryParams };
  }

  /**
   * Get a header value
   */
  getHeader(name: string): string | undefined {
    // Case-insensitive lookup
    for (const [key, value] of this._headers) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Check if header exists
   */
  hasHeader(name: string): boolean {
    for (const key of this._headers.keys()) {
      if (key.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all headers
   */
  getHeaders(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of this._headers) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Get request body
   */
  getBody(): unknown {
    return this._body;
  }

  /**
   * Get parsed body (alias for getBody for compatibility)
   */
  getParsedBody(): Record<string, unknown> | null {
    if (this._body && typeof this._body === 'object') {
      return this._body as Record<string, unknown>;
    }
    return null;
  }

  /**
   * Get a cookie value
   */
  getCookie(name: string): string | undefined {
    return this._cookies[name];
  }

  /**
   * Get all cookies
   */
  getCookies(): Record<string, string> {
    return { ...this._cookies };
  }

  /**
   * Get client IP address
   */
  getClientIp(): string {
    // Check various headers for real IP
    const xRealIp = this.getHeader(ServerRequest.HEADER_X_REAL_IP);
    if (xRealIp) return xRealIp;

    const cfIp = this.getHeader(ServerRequest.HEADER_CF_CONNECTING_IP);
    if (cfIp) return cfIp;

    const forwardedFor = this.getHeader(ServerRequest.HEADER_X_FORWARDED_FOR);
    if (forwardedFor) {
      // Take first IP in chain
      return forwardedFor.split(',')[0]?.trim() ?? '';
    }

    // Fall back to server params
    const remoteAddr = this._serverParams[ServerRequest.REMOTE_ADDR];
    if (typeof remoteAddr === 'string') return remoteAddr;

    return '127.0.0.1';
  }

  /**
   * Get user agent
   */
  getUserAgent(): string {
    return this.getHeader(ServerRequest.HEADER_USER_AGENT) ?? '';
  }

  /**
   * Get referrer
   */
  getReferer(): string {
    return this.getHeader(ServerRequest.HEADER_REFERER) ?? '';
  }

  /**
   * Get server params
   */
  getServerParams(): Record<string, unknown> {
    return { ...this._serverParams };
  }

  /**
   * Get an attribute
   */
  getAttribute<T = unknown>(name: string): T | undefined {
    return this._attributes.get(name) as T | undefined;
  }

  /**
   * Set an attribute
   */
  withAttribute(name: string, value: unknown): ServerRequest {
    const cloned = this.clone();
    cloned._attributes.set(name, value);
    return cloned;
  }

  /**
   * Return a new request with modified query params
   */
  withQueryParams(params: Record<string, string>): ServerRequest {
    const cloned = this.clone();
    cloned._queryParams = { ...this._queryParams, ...params };
    return cloned;
  }

  /**
   * Return a new request with added headers
   */
  withHeaders(headers: Record<string, string>): ServerRequest {
    const cloned = this.clone();
    for (const [key, value] of Object.entries(headers)) {
      cloned._headers.set(key, value);
    }
    return cloned;
  }

  /**
   * Return a new request without a header
   */
  withoutHeader(name: string): ServerRequest {
    const cloned = this.clone();
    // Case-insensitive removal
    for (const key of cloned._headers.keys()) {
      if (key.toLowerCase() === name.toLowerCase()) {
        cloned._headers.delete(key);
      }
    }
    return cloned;
  }

  /**
   * Return a new request with modified server params
   */
  withServerParams(params: Record<string, unknown>): ServerRequest {
    const cloned = this.clone();
    cloned._serverParams = { ...this._serverParams, ...params };
    return cloned;
  }

  /**
   * Return a new request with modified cookies
   */
  withCookieParam(name: string, value: string): ServerRequest {
    const cloned = this.clone();
    cloned._cookies[name] = value;
    return cloned;
  }

  /**
   * Clone the request
   */
  private clone(): ServerRequest {
    return new ServerRequest({
      method: this._method,
      uri: new URL(this._uri.toString()),
      headers: Object.fromEntries(this._headers),
      queryParams: { ...this._queryParams },
      body: this._body,
      cookies: { ...this._cookies },
      serverParams: { ...this._serverParams },
      attributes: Object.fromEntries(this._attributes)
    });
  }
}

/**
 * Server request constructor options
 */
export interface ServerRequestOptions {
  method?: string;
  uri?: URL;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: unknown;
  cookies?: Record<string, string>;
  serverParams?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}
