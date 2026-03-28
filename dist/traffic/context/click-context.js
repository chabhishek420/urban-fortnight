"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickContext = void 0;
/**
 * Click Context
 *
 * Main click processing context. Handles regular traffic clicks
 * through the standard pipeline.
 *
 * @see keitaro_source/application/Traffic/Context/ClickContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const click_dispatcher_js_1 = require("../dispatcher/click-dispatcher.js");
class ClickContext extends context_interface_js_1.BaseContext {
    /**
     * Initialize click context - setup logging and traffic tracking
     */
    bootstrap() {
        // In production: Bootstrap::initClickContext()
        // In production: TrafficLoggerService::reset()
        // In production: Setup traffic log entry if enabled
    }
    /**
     * Modify request - resolve real IP address
     */
    modifyRequest(request) {
        // Find real IP from various headers
        const realIp = this.findRealIp(request);
        return request.withServerParams({
            REMOTE_ADDR: realIp
        });
    }
    /**
     * Return click dispatcher
     */
    dispatcher(_request) {
        // In production: TrafficLoggerService::instance()->entry()->add("[ClickContext]")
        return new click_dispatcher_js_1.ClickDispatcher();
    }
    /**
     * Cleanup after request
     */
    shutdown() {
        // In production: TrafficLoggerService::instance()->flush()
    }
    /**
     * Handle exceptions
     */
    handleException(error, _request) {
        return this.createErrorResponse(error);
    }
    /**
     * Find real IP address from request
     */
    findRealIp(request) {
        return request.getClientIp();
    }
    /**
     * Create error response
     */
    createErrorResponse(error) {
        const { Response } = require('../response/response.js');
        const { StatusCode } = require('../response/status-code.js');
        return Response.buildJson({
            status: StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message,
                timestamp: new Date().toISOString()
            }
        });
    }
}
exports.ClickContext = ClickContext;
//# sourceMappingURL=click-context.js.map