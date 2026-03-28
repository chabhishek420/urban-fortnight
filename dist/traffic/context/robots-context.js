"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobotsContext = void 0;
/**
 * Robots Context
 *
 * Handles robots.txt requests.
 * Returns allow/disallow directives based on domain settings.
 *
 * @see keitaro_source/application/Traffic/Context/RobotsContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const robots_dispatcher_js_1 = require("../dispatcher/robots-dispatcher.js");
class RobotsContext extends context_interface_js_1.BaseContext {
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
     * Return robots dispatcher
     */
    dispatcher(_request) {
        return new robots_dispatcher_js_1.RobotsDispatcher();
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
}
exports.RobotsContext = RobotsContext;
//# sourceMappingURL=robots-context.js.map