/**
 * Server Request Class
 *
 * Represents an HTTP request with all relevant information.
 *
 * @see keitaro_source/application/Traffic/Request/ServerRequest.php
 */
export declare class ServerRequest {
    private _method;
    private _uri;
    private _headers;
    private _queryParams;
    private _body;
    private _cookies;
    private _serverParams;
    private _attributes;
    static readonly HEADER_X_REAL_IP = "X-Real-IP";
    static readonly HEADER_X_FORWARDED_FOR = "X-Forwarded-For";
    static readonly HEADER_CF_CONNECTING_IP = "CF-Connecting-IP";
    static readonly HEADER_CF_IPCOUNTRY = "CF-IPCountry";
    static readonly HEADER_USER_AGENT = "User-Agent";
    static readonly HEADER_REFERER = "Referer";
    static readonly HEADER_HOST = "Host";
    static readonly HEADER_CONTENT_TYPE = "Content-Type";
    static readonly REMOTE_ADDR = "REMOTE_ADDR";
    constructor(options?: ServerRequestOptions);
    /**
     * Build from Node.js IncomingMessage-like object
     */
    static build(options?: ServerRequestOptions): ServerRequest;
    /**
     * Get HTTP method
     */
    getMethod(): string;
    /**
     * Get request URI
     */
    getUri(): URL;
    /**
     * Get request path
     */
    getPath(): string;
    /**
     * Get a query parameter
     */
    getParam(name: string): string | undefined;
    /**
     * Check if query parameter exists
     */
    hasParam(name: string): boolean;
    /**
     * Get all query parameters
     */
    getQueryParams(): Record<string, string>;
    /**
     * Get a header value
     */
    getHeader(name: string): string | undefined;
    /**
     * Check if header exists
     */
    hasHeader(name: string): boolean;
    /**
     * Get all headers
     */
    getHeaders(): Record<string, string>;
    /**
     * Get request body
     */
    getBody(): unknown;
    /**
     * Get parsed body (alias for getBody for compatibility)
     */
    getParsedBody(): Record<string, unknown> | null;
    /**
     * Get a cookie value
     */
    getCookie(name: string): string | undefined;
    /**
     * Get all cookies
     */
    getCookies(): Record<string, string>;
    /**
     * Get client IP address
     */
    getClientIp(): string;
    /**
     * Get user agent
     */
    getUserAgent(): string;
    /**
     * Get referrer
     */
    getReferer(): string;
    /**
     * Get server params
     */
    getServerParams(): Record<string, unknown>;
    /**
     * Get an attribute
     */
    getAttribute<T = unknown>(name: string): T | undefined;
    /**
     * Set an attribute
     */
    withAttribute(name: string, value: unknown): ServerRequest;
    /**
     * Return a new request with modified query params
     */
    withQueryParams(params: Record<string, string>): ServerRequest;
    /**
     * Return a new request with added headers
     */
    withHeaders(headers: Record<string, string>): ServerRequest;
    /**
     * Return a new request without a header
     */
    withoutHeader(name: string): ServerRequest;
    /**
     * Return a new request with modified server params
     */
    withServerParams(params: Record<string, unknown>): ServerRequest;
    /**
     * Return a new request with modified cookies
     */
    withCookieParam(name: string, value: string): ServerRequest;
    /**
     * Clone the request
     */
    private clone;
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
//# sourceMappingURL=server-request.d.ts.map