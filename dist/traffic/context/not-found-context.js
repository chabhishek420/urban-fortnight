"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundContext = void 0;
/**
 * Not Found Context
 *
 * Handles 404 Not Found responses.
 * Used when no matching route is found for the request.
 *
 * @see keitaro_source/application/Traffic/Context/NotFoundContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const dispatcher_interface_js_1 = require("../../core/dispatcher/dispatcher-interface.js");
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
class NotFoundContext extends context_interface_js_1.BaseContext {
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
     * Return simple 404 response
     */
    dispatcher(_request) {
        const response = new response_js_1.Response({
            status: status_code_js_1.StatusCode.NOT_FOUND,
            disableCache: true
        })
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.HTML)
            .withBody('Not Found');
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
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message
            }
        });
    }
}
exports.NotFoundContext = NotFoundContext;
//# sourceMappingURL=not-found-context.js.map