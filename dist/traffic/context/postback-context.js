"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostbackContext = void 0;
/**
 * Postback Context
 *
 * Handles postback/conversion tracking requests.
 * Receives conversion data from affiliate networks and advertisers.
 *
 * @see keitaro_source/application/Traffic/Context/PostbackContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const postback_dispatcher_js_1 = require("../dispatcher/postback-dispatcher.js");
class PostbackContext extends context_interface_js_1.BaseContext {
    /**
     * Initialize CLI context for postbacks
     */
    bootstrap() {
        // In production: Bootstrap::initCliContext()
    }
    /**
     * No request modification needed for postbacks
     */
    modifyRequest(request) {
        return request;
    }
    /**
     * Return postback dispatcher
     */
    dispatcher(_request) {
        return new postback_dispatcher_js_1.PostbackDispatcher();
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
    createErrorResponse(error) {
        const { Response } = require('../response/response.js');
        const { StatusCode } = require('../response/status-code.js');
        return Response.buildJson({
            status: StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message
            }
        });
    }
}
exports.PostbackContext = PostbackContext;
//# sourceMappingURL=postback-context.js.map