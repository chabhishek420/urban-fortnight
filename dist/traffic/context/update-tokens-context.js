"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTokensContext = void 0;
/**
 * Update Tokens Context
 *
 * Handles token update requests.
 * Updates click tokens with additional parameters.
 *
 * @see keitaro_source/application/Traffic/Context/UpdateTokensContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const update_tokens_dispatcher_js_1 = require("../dispatcher/update-tokens-dispatcher.js");
class UpdateTokensContext extends context_interface_js_1.BaseContext {
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
     * Return update tokens dispatcher
     */
    dispatcher(_request) {
        return new update_tokens_dispatcher_js_1.UpdateTokensDispatcher();
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
exports.UpdateTokensContext = UpdateTokensContext;
//# sourceMappingURL=update-tokens-context.js.map