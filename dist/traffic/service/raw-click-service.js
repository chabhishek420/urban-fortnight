"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawClickService = void 0;
/**
 * Raw Click Service
 *
 * Handles raw click processing operations.
 *
 * @see keitaro_source/application/Traffic/Service/RawClickService.php
 */
const abstract_service_js_1 = require("./abstract-service.js");
class RawClickService extends abstract_service_js_1.AbstractService {
    static INSERT_LIMIT = 1000;
    static SUBID_LENGTH = 30;
    static SUBID_SEQ_KEY = 'SUBIDSEQ';
    _geoDbService = null;
    _subIdCounter = 0;
    /**
     * Set GeoDB service for IP resolution
     */
    setGeoDbService(service) {
        this._geoDbService = service;
    }
    /**
     * Resolve geo information for a raw click
     */
    async resolveGeo(rawClick) {
        // Check if already resolved
        if (rawClick.get('is_geo_resolved') || rawClick.getCountry()) {
            return;
        }
        rawClick.set('is_geo_resolved', true);
        if (!this._geoDbService) {
            return;
        }
        try {
            const ipInfo = await this._geoDbService.getIpInfo(rawClick.getIp());
            for (const [dataType, value] of Object.entries(ipInfo)) {
                rawClick.set(dataType, value);
            }
            // Handle Cloudflare country header override
            const cfCountry = rawClick.get('cf_country');
            if (cfCountry) {
                rawClick.setCountry(cfCountry);
            }
            // Set cellular connection type if operator is present
            if (rawClick.get('operator') && !rawClick.getConnectionType()) {
                rawClick.setConnectionType('cellular');
            }
        }
        catch (error) {
            console.error('Failed to resolve geo:', error);
        }
    }
    /**
     * Generate a unique sub ID for a click
     */
    generateSubId(visitorCode) {
        this._subIdCounter++;
        const randomness = this._subIdCounter.toString(32);
        const subId = (visitorCode + randomness).substring(0, RawClickService.SUBID_LENGTH);
        return subId;
    }
    /**
     * Generate sub ID with custom prefix
     */
    generateSubIdWithPrefix(prefix, length = RawClickService.SUBID_LENGTH) {
        this._subIdCounter++;
        const counter = this._subIdCounter.toString(36).padStart(6, '0');
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        let subId = prefix + timestamp + counter + random;
        if (subId.length > length) {
            subId = subId.substring(0, length);
        }
        return subId.toLowerCase();
    }
    /**
     * Reset the sub ID counter (for testing)
     */
    resetSubIdCounter() {
        this._subIdCounter = 0;
    }
    /**
     * Parse IP string to numeric representation
     */
    ipToNumber(ip) {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4) {
            return 0;
        }
        return ((parts[0] ?? 0) << 24) + ((parts[1] ?? 0) << 16) + ((parts[2] ?? 0) << 8) + (parts[3] ?? 0);
    }
    /**
     * Convert numeric IP to string
     */
    numberToIp(num) {
        return [
            (num >>> 24) & 0xFF,
            (num >>> 16) & 0xFF,
            (num >>> 8) & 0xFF,
            num & 0xFF
        ].join('.');
    }
    /**
     * Check if IP is in private range
     */
    isPrivateIp(ip) {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4) {
            return false;
        }
        const p0 = parts[0] ?? 0;
        const p1 = parts[1] ?? 0;
        // 10.0.0.0 - 10.255.255.255
        if (p0 === 10)
            return true;
        // 172.16.0.0 - 172.31.255.255
        if (p0 === 172 && p1 >= 16 && p1 <= 31)
            return true;
        // 192.168.0.0 - 192.168.255.255
        if (p0 === 192 && p1 === 168)
            return true;
        // 127.0.0.0 - 127.255.255.255 (localhost)
        if (p0 === 127)
            return true;
        return false;
    }
}
exports.RawClickService = RawClickService;
//# sourceMappingURL=raw-click-service.js.map