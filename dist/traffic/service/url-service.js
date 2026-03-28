"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
/**
 * URL Service
 *
 * Provides URL manipulation utilities.
 *
 * @see keitaro_source/application/Traffic/Service/UrlService.php
 */
const abstract_service_js_1 = require("./abstract-service.js");
class UrlService extends abstract_service_js_1.AbstractService {
    /**
     * Get base URL from a URI
     */
    getBaseUrl(uri, strip = 2) {
        let result = uri.protocol + '//';
        result += this.stripHostWww(uri);
        result += this.getBasePath(uri, strip);
        return result;
    }
    /**
     * Get base path from a URI
     */
    getBasePath(uri, depth = 1) {
        let path = uri.pathname;
        if (path) {
            // Remove query string
            path = path.replace(/\?.*/, '');
            const parts = path.split('/');
            // Remove trailing empty parts
            if (parts[parts.length - 1] === '') {
                parts.pop();
            }
            // Strip depth
            for (let i = 0; i < depth; i++) {
                parts.pop();
            }
            return parts.join('/');
        }
        return '';
    }
    /**
     * Strip www from hostname
     */
    stripHostWww(uri) {
        return uri.hostname.replace(/^www\./i, '');
    }
    /**
     * Get base path with trailing slash
     */
    getBasePathWithSlash(uri, depth = 1) {
        const basePath = this.getBasePath(uri, depth);
        if (basePath.length > 0) {
            return basePath + '/';
        }
        return '';
    }
    /**
     * Add parameter to URL
     */
    addParameterToUrl(oldUrl, addToQuery) {
        try {
            const uri = new URL(oldUrl);
            // Check if addToQuery is a path
            if (addToQuery.startsWith('/') || addToQuery.startsWith('\\')) {
                let path = uri.pathname;
                const lastChar = path.slice(-1);
                if (lastChar === '/' || lastChar === '\\') {
                    addToQuery = addToQuery.slice(1);
                }
                uri.pathname = path + addToQuery;
            }
            else {
                // Parse as query string
                const initialQueryParams = this.parseStr(uri.search);
                const paramQueryParams = this.parseStr(addToQuery);
                const newQueryParams = { ...initialQueryParams, ...paramQueryParams };
                const searchParams = new URLSearchParams();
                for (const [key, value] of Object.entries(newQueryParams)) {
                    searchParams.set(key, value);
                }
                uri.search = searchParams.toString();
            }
            let newUrl = uri.toString();
            // Restore macro placeholders
            newUrl = newUrl
                .replace(/%7B/g, '{')
                .replace(/%7D/g, '}')
                .replace(/%3A/g, ':');
            return newUrl;
        }
        catch {
            console.warn(`URI: incorrect offer URL ${oldUrl}`);
            return oldUrl;
        }
    }
    /**
     * Filter double slashes from URL
     */
    filterDoubleSlashes(url) {
        return url.replace(/([^:])(\/{2,})/g, '$1/');
    }
    /**
     * Parse query string into object
     */
    parseStr(str) {
        const out = {};
        // Clean the string
        str = str.trim().replace(/^[&?]+/, '');
        if (str === '') {
            return out;
        }
        const params = str.split('&');
        for (const param of params) {
            if (param !== '') {
                const [key, ...valueParts] = param.split('=');
                let value = valueParts.join('=') ?? '';
                // Restore macro placeholders
                value = value
                    .replace(/%7B/g, '{')
                    .replace(/%7D/g, '}')
                    .replace(/%3A/g, ':');
                out[key] = value;
            }
        }
        return out;
    }
    /**
     * Build query string from object
     */
    buildQuery(params) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            searchParams.set(key, String(value));
        }
        return searchParams.toString();
    }
    /**
     * Check if URL is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Join URL parts safely
     */
    joinParts(...parts) {
        let result = parts[0] ?? '';
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (part === undefined)
                continue;
            if (result.endsWith('/')) {
                result += part.startsWith('/') ? part.slice(1) : part;
            }
            else {
                result += part.startsWith('/') ? part : '/' + part;
            }
        }
        return this.filterDoubleSlashes(result);
    }
}
exports.UrlService = UrlService;
//# sourceMappingURL=url-service.js.map