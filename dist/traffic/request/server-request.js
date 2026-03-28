"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRequest = void 0;
/**
 * Server Request Class
 *
 * Represents an HTTP request with all relevant information.
 *
 * @see keitaro_source/application/Traffic/Request/ServerRequest.php
 */
class ServerRequest {
    _method;
    _uri;
    _headers;
    _queryParams;
    _body;
    _cookies;
    _serverParams;
    _attributes;
    // Header constants
    static HEADER_X_REAL_IP = 'X-Real-IP';
    static HEADER_X_FORWARDED_FOR = 'X-Forwarded-For';
    static HEADER_CF_CONNECTING_IP = 'CF-Connecting-IP';
    static HEADER_CF_IPCOUNTRY = 'CF-IPCountry';
    static HEADER_USER_AGENT = 'User-Agent';
    static HEADER_REFERER = 'Referer';
    static HEADER_HOST = 'Host';
    static HEADER_CONTENT_TYPE = 'Content-Type';
    static REMOTE_ADDR = 'REMOTE_ADDR';
    constructor(options = {}) {
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
    static build(options = {}) {
        return new ServerRequest(options);
    }
    /**
     * Get HTTP method
     */
    getMethod() {
        return this._method;
    }
    /**
     * Get request URI
     */
    getUri() {
        return this._uri;
    }
    /**
     * Get request path
     */
    getPath() {
        return this._uri.pathname;
    }
    /**
     * Get a query parameter
     */
    getParam(name) {
        return this._queryParams[name] ?? this._uri.searchParams.get(name) ?? undefined;
    }
    /**
     * Check if query parameter exists
     */
    hasParam(name) {
        return name in this._queryParams || this._uri.searchParams.has(name);
    }
    /**
     * Get all query parameters
     */
    getQueryParams() {
        return { ...this._queryParams };
    }
    /**
     * Get a header value
     */
    getHeader(name) {
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
    hasHeader(name) {
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
    getHeaders() {
        const result = {};
        for (const [key, value] of this._headers) {
            result[key] = value;
        }
        return result;
    }
    /**
     * Get request body
     */
    getBody() {
        return this._body;
    }
    /**
     * Get parsed body (alias for getBody for compatibility)
     */
    getParsedBody() {
        if (this._body && typeof this._body === 'object') {
            return this._body;
        }
        return null;
    }
    /**
     * Get a cookie value
     */
    getCookie(name) {
        return this._cookies[name];
    }
    /**
     * Get all cookies
     */
    getCookies() {
        return { ...this._cookies };
    }
    /**
     * Get client IP address
     */
    getClientIp() {
        // Check various headers for real IP
        const xRealIp = this.getHeader(ServerRequest.HEADER_X_REAL_IP);
        if (xRealIp)
            return xRealIp;
        const cfIp = this.getHeader(ServerRequest.HEADER_CF_CONNECTING_IP);
        if (cfIp)
            return cfIp;
        const forwardedFor = this.getHeader(ServerRequest.HEADER_X_FORWARDED_FOR);
        if (forwardedFor) {
            // Take first IP in chain
            return forwardedFor.split(',')[0]?.trim() ?? '';
        }
        // Fall back to server params
        const remoteAddr = this._serverParams[ServerRequest.REMOTE_ADDR];
        if (typeof remoteAddr === 'string')
            return remoteAddr;
        return '127.0.0.1';
    }
    /**
     * Get user agent
     */
    getUserAgent() {
        return this.getHeader(ServerRequest.HEADER_USER_AGENT) ?? '';
    }
    /**
     * Get referrer
     */
    getReferer() {
        return this.getHeader(ServerRequest.HEADER_REFERER) ?? '';
    }
    /**
     * Get server params
     */
    getServerParams() {
        return { ...this._serverParams };
    }
    /**
     * Get an attribute
     */
    getAttribute(name) {
        return this._attributes.get(name);
    }
    /**
     * Set an attribute
     */
    withAttribute(name, value) {
        const cloned = this.clone();
        cloned._attributes.set(name, value);
        return cloned;
    }
    /**
     * Return a new request with modified query params
     */
    withQueryParams(params) {
        const cloned = this.clone();
        cloned._queryParams = { ...this._queryParams, ...params };
        return cloned;
    }
    /**
     * Return a new request with added headers
     */
    withHeaders(headers) {
        const cloned = this.clone();
        for (const [key, value] of Object.entries(headers)) {
            cloned._headers.set(key, value);
        }
        return cloned;
    }
    /**
     * Return a new request without a header
     */
    withoutHeader(name) {
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
    withServerParams(params) {
        const cloned = this.clone();
        cloned._serverParams = { ...this._serverParams, ...params };
        return cloned;
    }
    /**
     * Return a new request with modified cookies
     */
    withCookieParam(name, value) {
        const cloned = this.clone();
        cloned._cookies[name] = value;
        return cloned;
    }
    /**
     * Clone the request
     */
    clone() {
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
exports.ServerRequest = ServerRequest;
//# sourceMappingURL=server-request.js.map