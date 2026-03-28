"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayRedirectContext = void 0;
/**
 * Gateway Redirect Context
 *
 * Handles gateway redirects for landing page redirects.
 * Uses JWT tokens for secure URL encoding.
 *
 * @see keitaro_source/application/Traffic/Context/GatewayRedirectContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const dispatcher_interface_js_1 = require("../../core/dispatcher/dispatcher-interface.js");
const gateway_redirect_dispatcher_js_1 = require("../dispatcher/gateway-redirect-dispatcher.js");
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
class GatewayRedirectContext extends context_interface_js_1.BaseContext {
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
     * Return gateway redirect dispatcher with token validation
     */
    dispatcher(request) {
        const token = request.getParam('token');
        if (!token) {
            return new dispatcher_interface_js_1.SimpleDispatcher(this.errorResponse('Empty token', status_code_js_1.StatusCode.BAD_REQUEST));
        }
        return new gateway_redirect_dispatcher_js_1.GatewayRedirectDispatcher();
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
        return this.createErrorResponse(error);
    }
    /**
     * Create error response
     */
    errorResponse(message, status = status_code_js_1.StatusCode.INTERNAL_SERVER_ERROR) {
        return response_js_1.Response.buildHtml({
            body: message,
            status
        });
    }
    /**
     * Create generic error response
     */
    createErrorResponse(error) {
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message
            }
        });
    }
}
exports.GatewayRedirectContext = GatewayRedirectContext;
//# sourceMappingURL=gateway-redirect-context.js.map