"use strict";
/**
 * Core Context Interface
 *
 * Contexts define how requests are processed in different scenarios.
 * Each context implements the full request lifecycle: bootstrap → modify → dispatch → shutdown
 *
 * @see keitaro_source/application/Core/Context/ContextInterface.php
 * @artifact ARTIFACT-002: Original declared as 'final class', corrected to interface
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContext = void 0;
const response_1 = require("../../traffic/response/response");
const status_code_1 = require("../../traffic/response/status-code");
/**
 * Base context implementation with common functionality
 */
class BaseContext {
    handleException(error, _request) {
        return response_1.Response.buildJson({
            status: status_code_1.StatusCode.INTERNAL_SERVER_ERROR,
            body: {
                error: error.message,
                timestamp: new Date().toISOString()
            }
        });
    }
}
exports.BaseContext = BaseContext;
//# sourceMappingURL=context-interface.js.map