"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobotsDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
class RobotsDispatcher {
    static ROBOTS_DISALLOW = 'User-agent: *\nDisallow: /';
    static ROBOTS_ALLOW = 'User-agent: *\nAllow: /';
    /**
     * Dispatch robots.txt request
     */
    dispatch(request) {
        const robotsContent = this.getRobotsContent(request);
        return new response_js_1.Response({
            status: status_code_js_1.StatusCode.OK,
            disableCache: true
        })
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.TEXT)
            .withBody(robotsContent);
    }
    /**
     * Get robots.txt content
     */
    getRobotsContent(request) {
        const allowIndexing = this.findDomainRobots(request);
        if (!allowIndexing) {
            return RobotsDispatcher.ROBOTS_DISALLOW;
        }
        return RobotsDispatcher.ROBOTS_ALLOW;
    }
    /**
     * Find domain indexing setting
     */
    findDomainRobots(_request) {
        // In production: Query CachedDomainRepository for domain settings
        // const domains = CachedDomainRepository::instance()->allActiveCached();
        // const requestedDomain = request.getUri().getHost();
        // Find matching domain and return allow_indexing setting
        // Default: disallow indexing
        return false;
    }
}
exports.RobotsDispatcher = RobotsDispatcher;
//# sourceMappingURL=robots-dispatcher.js.map