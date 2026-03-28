"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpFilter = void 0;
/**
 * IP Filter
 *
 * Filters clicks based on IP address or range.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Ip.php
 */
const filter_interface_js_1 = require("./filter-interface.js");
const stream_filter_js_1 = require("./stream-filter.js");
class IpFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'ip';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    getTooltip() {
        return 'Filter by IP address, CIDR range, or IP range';
    }
    isPass(filter, rawClick) {
        const ip = rawClick.getIp();
        const payload = filter.getPayload();
        if (!Array.isArray(payload) || !ip) {
            return true;
        }
        let found = false;
        for (const string of payload) {
            // Parse comma or semicolon separated values
            const tokens = string.split(/[,;]/).map(t => t.trim()).filter(t => t);
            for (const token of tokens) {
                if (this.checkIp(token, ip)) {
                    found = true;
                    break;
                }
            }
            if (found)
                break;
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
    /**
     * Check if IP matches a mask
     */
    checkIp(mask, ip) {
        // CIDR notation (e.g., 192.168.1.0/24)
        if (mask.includes('/')) {
            return this.ipInCIDR(ip, mask);
        }
        // IP range (e.g., 192.168.1.1-192.168.1.255)
        if (mask.includes('-')) {
            return this.ipInRange(ip, mask);
        }
        // Wildcard mask (e.g., 192.168.1.*)
        if (mask.includes('*')) {
            return this.ipInWildcard(ip, mask);
        }
        // Exact match
        return ip === mask;
    }
    /**
     * Check if IP is in CIDR range
     */
    ipInCIDR(ip, cidr) {
        const [range, bits] = cidr.split('/');
        const mask = parseInt(bits ?? '32', 10);
        const ipNum = this.ipToNumber(ip);
        const rangeNum = this.ipToNumber(range ?? '');
        if (ipNum === 0 || rangeNum === 0)
            return false;
        const maskNum = ~((1 << (32 - mask)) - 1);
        return (ipNum & maskNum) === (rangeNum & maskNum);
    }
    /**
     * Check if IP is in range
     */
    ipInRange(ip, range) {
        const [start, end] = range.split('-').map(s => s.trim());
        const ipNum = this.ipToNumber(ip);
        const startNum = this.ipToNumber(start ?? '');
        const endNum = this.ipToNumber(end ?? '');
        return ipNum >= startNum && ipNum <= endNum;
    }
    /**
     * Check if IP matches wildcard pattern
     */
    ipInWildcard(ip, pattern) {
        const ipParts = ip.split('.');
        const patternParts = pattern.split('.');
        if (ipParts.length !== 4 || patternParts.length !== 4) {
            return false;
        }
        for (let i = 0; i < 4; i++) {
            if (patternParts[i] !== '*' && ipParts[i] !== patternParts[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Convert IP string to number
     */
    ipToNumber(ip) {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(isNaN)) {
            return 0;
        }
        return ((parts[0] ?? 0) << 24) + ((parts[1] ?? 0) << 16) + ((parts[2] ?? 0) << 8) + (parts[3] ?? 0);
    }
}
exports.IpFilter = IpFilter;
//# sourceMappingURL=ip-filter.js.map