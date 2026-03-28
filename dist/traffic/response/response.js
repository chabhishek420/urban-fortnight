"use strict";
/**
 * HTTP Response Class
 *
 * Represents an HTTP response with builder pattern for easy construction.
 *
 * @see keitaro_source/application/Traffic/Response/Response.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = exports.StatusCode = exports.Response = void 0;
const status_code_1 = require("./status-code");
const content_type_1 = require("./content-type");
class Response {
    _status = status_code_1.StatusCode.OK;
    _headers = new Map();
    _body = null;
    _disableCache = false;
    constructor(options = {}) {
        if (options.status !== undefined)
            this._status = options.status;
        if (options.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                this.withHeader(key, value);
            }
        }
        if (options.body !== undefined)
            this._body = options.body;
        if (options.disableCache !== undefined)
            this._disableCache = options.disableCache;
    }
    /**
     * Create a new response builder
     */
    static build() {
        return new Response();
    }
    /**
     * Build an HTML response
     */
    static buildHtml(options = {}) {
        const response = new Response({
            status: options.status ?? status_code_1.StatusCode.OK,
            body: options.body ?? '',
            disableCache: options.disableCache ?? true
        });
        response.withHeader(content_type_1.ContentType.HEADER, content_type_1.ContentType.HTML);
        if (options.disableCache !== false) {
            response.withCacheDisabled();
        }
        return response;
    }
    /**
     * Build a JSON response
     */
    static buildJson(options) {
        const body = typeof options.body === 'string'
            ? options.body
            : JSON.stringify(options.body);
        const response = new Response({
            status: options.status ?? status_code_1.StatusCode.OK,
            body,
            disableCache: options.disableCache ?? true
        });
        response.withHeader(content_type_1.ContentType.HEADER, content_type_1.ContentType.JSON);
        return response;
    }
    /**
     * Build a redirect response
     */
    static buildRedirect(url, status = status_code_1.StatusCode.FOUND) {
        return new Response()
            .withStatus(status)
            .withHeader('Location', url);
    }
    /**
     * Build a text response
     */
    static buildText(body, status = status_code_1.StatusCode.OK) {
        return new Response({ body, status })
            .withHeader(content_type_1.ContentType.HEADER, content_type_1.ContentType.TEXT);
    }
    /**
     * Set response status
     */
    withStatus(status) {
        this._status = status;
        return this;
    }
    /**
     * Set a header (replaces existing)
     */
    withHeader(name, value) {
        this._headers.set(name, Array.isArray(value) ? value : [value]);
        return this;
    }
    /**
     * Append to a header
     */
    appendHeader(name, value) {
        const existing = this._headers.get(name) ?? [];
        existing.push(value);
        this._headers.set(name, existing);
        return this;
    }
    /**
     * Remove a header
     */
    withoutHeader(name) {
        this._headers.delete(name);
        return this;
    }
    /**
     * Set response body
     */
    withBody(body) {
        this._body = body;
        return this;
    }
    /**
     * Disable caching
     */
    withCacheDisabled() {
        this._disableCache = true;
        this.withHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        this.withHeader('Pragma', 'no-cache');
        return this;
    }
    /**
     * Get response status
     */
    getStatus() {
        return this._status;
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
     * Get a specific header
     */
    getHeader(name) {
        return this._headers.get(name);
    }
    /**
     * Get response body
     */
    getBody() {
        return this._body;
    }
    /**
     * Check if caching is disabled
     */
    isCacheDisabled() {
        return this._disableCache;
    }
    /**
     * Convert to string (for debugging)
     */
    toString() {
        return `Response(status=${this._status}, headers=${JSON.stringify(this.getHeaders())})`;
    }
}
exports.Response = Response;
// Re-export StatusCode and ContentType for convenience
var status_code_2 = require("./status-code");
Object.defineProperty(exports, "StatusCode", { enumerable: true, get: function () { return status_code_2.StatusCode; } });
var content_type_2 = require("./content-type");
Object.defineProperty(exports, "ContentType", { enumerable: true, get: function () { return content_type_2.ContentType; } });
//# sourceMappingURL=response.js.map