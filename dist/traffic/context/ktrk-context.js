"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KtrkContext = void 0;
/**
 * KTRK Context (JSONP Tracking)
 *
 * Handles JSONP-based tracking requests.
 * Returns JavaScript responses for cross-domain tracking.
 *
 * @see keitaro_source/application/Traffic/Context/KtrkContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const ktrk_dispatcher_js_1 = require("../dispatcher/ktrk-dispatcher.js");
const payload_js_1 = require("../pipeline/payload.js");
const raw_click_js_1 = require("../model/raw-click.js");
class KtrkContext extends context_interface_js_1.BaseContext {
    static CAMPAIGN_NOT_FOUND = 'Campaign not found';
    /**
     * Initialize click context with logging
     */
    bootstrap() {
        // In production: Bootstrap::initClickContext()
        // In production: TrafficLoggerService::reset()
        // In production: Setup traffic log entry if enabled
    }
    /**
     * No request modification needed
     */
    modifyRequest(request) {
        return request;
    }
    /**
     * Return KTRK dispatcher with pipeline payload
     */
    dispatcher(request) {
        // In production: TrafficLoggerService::instance()->entry()->add("[KtrkContext]")
        const pipelinePayload = new payload_js_1.Payload({
            serverRequest: request,
            rawClick: new raw_click_js_1.RawClick()
        });
        pipelinePayload.setNeedToken(true);
        return new ktrk_dispatcher_js_1.KtrkDispatcher(pipelinePayload, 2);
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
exports.KtrkContext = KtrkContext;
//# sourceMappingURL=ktrk-context.js.map