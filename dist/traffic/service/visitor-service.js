"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorService = void 0;
/**
 * Visitor Service
 *
 * Handles visitor identification and tracking.
 *
 * @see keitaro_source/application/Traffic/Service/VisitorService.php
 */
const abstract_service_js_1 = require("./abstract-service.js");
class VisitorService extends abstract_service_js_1.AbstractService {
    /**
     * Generate a unique visitor code from raw click data
     * Uses murmurhash-like algorithm for consistent visitor identification
     */
    generateCode(rawClick) {
        const srcString = [
            rawClick.getIp() ?? '',
            rawClick.getUserAgent() ?? '',
            rawClick.getConnectionType() ?? '',
            rawClick.getCountry() ?? '',
            rawClick.getCity() ?? '',
            rawClick.getDeviceModel() ?? ''
        ].join('');
        return this.murmurhash3(srcString);
    }
    /**
     * MurmurHash3 implementation for generating consistent hash
     */
    murmurhash3(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
            h ^= h >>> 15;
        }
        h = Math.imul(h, 0x5bd1e995);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
        h ^= h >>> 16;
        return (h >>> 0).toString(16).padStart(8, '0');
    }
    /**
     * Check if visitor matches a previous visit pattern
     */
    isReturningVisitor(visitorCode, storedCodes) {
        return storedCodes.includes(visitorCode);
    }
    /**
     * Generate a visitor ID from IP and user agent
     */
    generateVisitorId(ip, userAgent) {
        const combined = `${ip}|${userAgent}`;
        return this.murmurhash3(combined);
    }
}
exports.VisitorService = VisitorService;
//# sourceMappingURL=visitor-service.js.map