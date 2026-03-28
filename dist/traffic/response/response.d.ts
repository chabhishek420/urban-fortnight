/**
 * HTTP Response Class
 *
 * Represents an HTTP response with builder pattern for easy construction.
 *
 * @see keitaro_source/application/Traffic/Response/Response.php
 */
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
export declare class Response {
    private _status;
    private _headers;
    private _body;
    private _disableCache;
    constructor(options?: ResponseOptions);
    /**
     * Create a new response builder
     */
    static build(): Response;
    /**
     * Build an HTML response
     */
    static buildHtml(options?: ResponseBuildOptions): Response;
    /**
     * Build a JSON response
     */
    static buildJson(options: JsonResponseOptions): Response;
    /**
     * Build a redirect response
     */
    static buildRedirect(url: string, status?: number): Response;
    /**
     * Build a text response
     */
    static buildText(body: string, status?: number): Response;
    /**
     * Set response status
     */
    withStatus(status: number): this;
    /**
     * Set a header (replaces existing)
     */
    withHeader(name: string, value: string | string[]): this;
    /**
     * Append to a header
     */
    appendHeader(name: string, value: string): this;
    /**
     * Remove a header
     */
    withoutHeader(name: string): this;
    /**
     * Set response body
     */
    withBody(body: string | Buffer | null): this;
    /**
     * Disable caching
     */
    withCacheDisabled(): this;
    /**
     * Get response status
     */
    getStatus(): number;
    /**
     * Get all headers
     */
    getHeaders(): Record<string, string[]>;
    /**
     * Get a specific header
     */
    getHeader(name: string): string[] | undefined;
    /**
     * Get response body
     */
    getBody(): string | Buffer | null;
    /**
     * Check if caching is disabled
     */
    isCacheDisabled(): boolean;
    /**
     * Convert to string (for debugging)
     */
    toString(): string;
}
export { StatusCode } from './status-code';
export { ContentType } from './content-type';
//# sourceMappingURL=response.d.ts.map