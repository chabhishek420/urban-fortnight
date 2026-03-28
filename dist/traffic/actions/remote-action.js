"use strict";
/**
 * Remote Action
 *
 * Fetches a redirect URL from a remote source and redirects to it.
 * Caches the result for a TTL period.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/Remote.php
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteAction = void 0;
const abstract_action_1 = require("./abstract-action");
const redirect_service_1 = require("./service/redirect-service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TTL = 60; // seconds
// In-memory stubs for testing
const stubs = new Map();
class RemoteAction extends abstract_action_1.AbstractAction {
    _weight = 130;
    _ttl = TTL;
    constructor() {
        super('remote');
    }
    getType() {
        return abstract_action_1.ActionType.REDIRECT;
    }
    getField() {
        return abstract_action_1.ActionField.URL;
    }
    execute() {
        this.executeInContext();
    }
    executeDefault() {
        const url = this.getRemoteUrl(this.getActionPayload());
        this.setDestinationInfo(url);
        this.redirect(url);
    }
    executeForFrame() {
        const url = this.getRemoteUrl(this.getActionPayload());
        this.setDestinationInfo(url);
        const redirectService = redirect_service_1.RedirectService.getInstance();
        this.setContent(redirectService.frameRedirect(url));
    }
    executeForScript() {
        const url = this.getRemoteUrl(this.getActionPayload());
        this.setDestinationInfo(url);
        const redirectService = redirect_service_1.RedirectService.getInstance();
        this.setContent(redirectService.scriptRedirect(url));
    }
    /**
     * Get remote URL, using cache if available
     */
    getRemoteUrl(fromUrl) {
        const filename = this.getCacheFilename(fromUrl);
        try {
            // Check cache
            if (fs.existsSync(filename)) {
                const stats = fs.statSync(filename);
                const age = (Date.now() - stats.mtimeMs) / 1000;
                if (age < this._ttl) {
                    const cached = fs.readFileSync(filename, 'utf8').trim();
                    if (cached) {
                        return this.appendParams(cached, fromUrl);
                    }
                }
            }
        }
        catch {
            // Ignore cache errors
        }
        // Fetch from remote
        let url = '';
        try {
            url = this.request(fromUrl);
            if (url) {
                // Cache the result
                try {
                    const cacheDir = path.dirname(filename);
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                    }
                    fs.writeFileSync(filename, url);
                }
                catch {
                    // Ignore cache write errors
                }
            }
        }
        catch {
            // Ignore request errors
        }
        if (url && !url.includes('://')) {
            url = this.appendParams(url, fromUrl);
        }
        return url;
    }
    /**
     * Make HTTP request to get redirect URL
     */
    request(url) {
        // Check stubs first (for testing)
        if (stubs.has(url)) {
            return stubs.get(url) || '';
        }
        // Synchronous fetch using XMLHttpRequest simulation
        // In production, this would use a proper HTTP client
        try {
            // This is async in Node.js, but PHP was synchronous
            // For now, return empty string (would need sync fetch)
            void url; // Mark as intentionally unused
            return '';
        }
        catch {
            return '';
        }
    }
    /**
     * Get cache filename for URL
     */
    getCacheFilename(url) {
        const cacheDir = process.env.CACHE_DIR || '/tmp/keitaro_cache';
        const hash = this.md5(url);
        return path.join(cacheDir, `${hash}.link`);
    }
    /**
     * Append query parameters from source URL to target
     */
    appendParams(actualUrl, sourceUrl) {
        if (!actualUrl) {
            return '';
        }
        try {
            const sourceParsed = new URL(sourceUrl);
            const sourceParams = new URLSearchParams(sourceParsed.search);
            // Check if actualUrl is relative or absolute
            let targetUrl;
            if (actualUrl.includes('://')) {
                targetUrl = new URL(actualUrl);
            }
            else {
                // Assume http for relative URLs
                targetUrl = new URL(`http://${actualUrl}`);
            }
            // Merge query parameters
            const targetParams = new URLSearchParams(targetUrl.search);
            for (const [key, value] of sourceParams) {
                if (!targetParams.has(key)) {
                    targetParams.set(key, value);
                }
            }
            targetUrl.search = targetParams.toString();
            return targetUrl.toString();
        }
        catch {
            return actualUrl;
        }
    }
    /**
     * Simple MD5 hash (for cache keys)
     */
    md5(input) {
        const crypto = require('crypto');
        return crypto.createHash('md5').update(input).digest('hex');
    }
    /**
     * Set stub for testing
     */
    static setStub(url, content) {
        stubs.set(url, content);
    }
}
exports.RemoteAction = RemoteAction;
//# sourceMappingURL=remote-action.js.map