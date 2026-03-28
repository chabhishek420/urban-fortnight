"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingDomainContext = void 0;
/**
 * Ping Domain Context
 *
 * Handles domain ping requests for health checks.
 * Returns the tracker code for the domain.
 *
 * @see keitaro_source/application/Traffic/Context/PingDomainContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const dispatcher_interface_js_1 = require("../../core/dispatcher/dispatcher-interface.js");
const response_js_1 = require("../response/response.js");
class PingDomainContext extends context_interface_js_1.BaseContext {
    /**
     * Initialize click context
     */
    bootstrap() {
        // In production: Bootstrap::initClickContext()
    }
    /**
     * No request modification needed
     */
    modifyRequest(request) {
        return request;
    }
    /**
     * Return tracker code response
     */
    dispatcher(_request) {
        // In production: Get tracker code from DomainService
        const trackerCode = this.getTrackerCode();
        const response = new response_js_1.Response({
            disableCache: true,
            body: trackerCode
        });
        return new dispatcher_interface_js_1.SimpleDispatcher(response);
    }
    /**
     * No cleanup needed
     */
    shutdown() {
        // No-op
    }
    /**
     * Handle exceptions
     */
    handleException(error, _request) {
        const { Response } = require('../response/response.js');
        const { StatusCode } = require('../response/status-code.js');
        return Response.buildJson({
            status: StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message
            }
        });
    }
    /**
     * Get tracker code for domain
     */
    getTrackerCode() {
        // In production: DomainService::instance()->getTrackerCode()
        return 'OK';
    }
}
exports.PingDomainContext = PingDomainContext;
//# sourceMappingURL=ping-domain-context.js.map