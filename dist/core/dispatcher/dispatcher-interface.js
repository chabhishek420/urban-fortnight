"use strict";
/**
 * Dispatcher Interface
 *
 * Dispatchers handle the actual request processing for each context.
 * They coordinate the pipeline execution and return the final response.
 *
 * @see keitaro_source/application/Core/Dispatcher/DispatcherInterface.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDispatcher = exports.SimpleDispatcher = void 0;
const response_1 = require("../../traffic/response/response");
const status_code_1 = require("../../traffic/response/status-code");
/**
 * Simple dispatcher that returns a pre-built response
 * Used for error responses and simple cases
 */
class SimpleDispatcher {
    response;
    constructor(response) {
        this.response = response;
    }
    dispatch(_request) {
        return this.response;
    }
}
exports.SimpleDispatcher = SimpleDispatcher;
/**
 * Base dispatcher with common functionality
 */
class AbstractDispatcher {
    /**
     * Create an error response
     */
    errorResponse(message, status = status_code_1.StatusCode.INTERNAL_SERVER_ERROR) {
        return response_1.Response.buildJson({
            status,
            body: { error: message }
        });
    }
    /**
     * Create an HTML response
     */
    htmlResponse(body, status = status_code_1.StatusCode.OK) {
        return response_1.Response.buildHtml({ body, status });
    }
    /**
     * Create a JSON response
     */
    jsonResponse(body, status = status_code_1.StatusCode.OK) {
        return response_1.Response.buildJson({ body, status });
    }
}
exports.AbstractDispatcher = AbstractDispatcher;
//# sourceMappingURL=dispatcher-interface.js.map