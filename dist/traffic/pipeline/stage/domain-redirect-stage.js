"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainRedirectStage = void 0;
const response_js_1 = require("../../response/response.js");
const status_code_js_1 = require("../../response/status-code.js");
/**
 * Domain redirect stage - handles SSL redirects
 */
class DomainRedirectStage {
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const request = payload.getServerRequest();
        // Check if request exists
        if (!request) {
            return payload;
        }
        // Check if host is an IP address - no redirect for IPs
        if (this._isIpAddress(request.getUri().host)) {
            return payload;
        }
        // Find domain redirect
        const redirect = this._findDomainRedirect(request);
        if (redirect && redirect !== request.getUri().protocol.replace(':', '')) {
            // Check CloudFlare scheme
            if (this._checkCloudFlareScheme(request)) {
                const path = request.getUri().toString().replace(request.getUri().protocol, `${redirect}:`);
                const response = payload.getResponse() ?? new response_js_1.Response();
                response.withStatus(status_code_js_1.StatusCode.MOVED_PERMANENTLY).withHeader('Location', path);
                payload.setResponse(response);
                payload.abort();
            }
        }
        return payload;
    }
    /**
     * Check if host is an IP address
     */
    _isIpAddress(host) {
        // IPv4 pattern
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        // IPv6 pattern (simplified)
        const ipv6Pattern = /^\[?[0-9a-fA-F:]+\]?$/;
        return ipv4Pattern.test(host) || ipv6Pattern.test(host);
    }
    /**
     * Check CloudFlare scheme header
     */
    _checkCloudFlareScheme(request) {
        const cfVisitorHeader = request.getHeader('CF-Visitor');
        if (cfVisitorHeader) {
            try {
                const scheme = JSON.parse(cfVisitorHeader);
                if (scheme.scheme === 'https') {
                    return false;
                }
            }
            catch {
                // Invalid JSON, continue
            }
        }
        return true;
    }
    /**
     * Find domain redirect setting
     * @artifact ARTIFACT-005: Simplified implementation without domain repository
     */
    _findDomainRedirect(_request) {
        // In original implementation, this would check CachedDomainRepository
        // For now, return null (no redirect)
        // TODO: Implement domain repository integration
        return null;
    }
}
exports.DomainRedirectStage = DomainRedirectStage;
//# sourceMappingURL=domain-redirect-stage.js.map