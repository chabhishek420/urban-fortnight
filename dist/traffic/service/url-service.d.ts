/**
 * URL Service
 *
 * Provides URL manipulation utilities.
 *
 * @see keitaro_source/application/Traffic/Service/UrlService.php
 */
import { AbstractService } from './abstract-service.js';
export declare class UrlService extends AbstractService {
    /**
     * Get base URL from a URI
     */
    getBaseUrl(uri: URL, strip?: number): string;
    /**
     * Get base path from a URI
     */
    getBasePath(uri: URL, depth?: number): string;
    /**
     * Strip www from hostname
     */
    stripHostWww(uri: URL): string;
    /**
     * Get base path with trailing slash
     */
    getBasePathWithSlash(uri: URL, depth?: number): string;
    /**
     * Add parameter to URL
     */
    addParameterToUrl(oldUrl: string, addToQuery: string): string;
    /**
     * Filter double slashes from URL
     */
    filterDoubleSlashes(url: string): string;
    /**
     * Parse query string into object
     */
    parseStr(str: string): Record<string, string>;
    /**
     * Build query string from object
     */
    buildQuery(params: Record<string, string | number | boolean>): string;
    /**
     * Check if URL is valid
     */
    isValidUrl(url: string): boolean;
    /**
     * Join URL parts safely
     */
    joinParts(...parts: string[]): string;
}
//# sourceMappingURL=url-service.d.ts.map