"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KClientJSContext = void 0;
/**
 * KClient JS Context
 *
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 *
 * @see keitaro_source/application/Traffic/Context/KClientJSContext.php
 */
const context_interface_js_1 = require("../../core/context/context-interface.js");
const kclient_js_dispatcher_js_1 = require("../dispatcher/kclient-js-dispatcher.js");
const payload_js_1 = require("../pipeline/payload.js");
const raw_click_js_1 = require("../model/raw-click.js");
class KClientJSContext extends context_interface_js_1.BaseContext {
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
     * Return KClient JS dispatcher with pipeline payload
     */
    dispatcher(request) {
        // In production: TrafficLoggerService::instance()->entry()->add("[KClientJSContext]")
        const pipelinePayload = new payload_js_1.Payload({
            serverRequest: request,
            rawClick: new raw_click_js_1.RawClick()
        });
        pipelinePayload.setNeedToken(true);
        pipelinePayload.setForceRedirectOffer(true);
        return new kclient_js_dispatcher_js_1.KClientJSDispatcher(pipelinePayload, 2);
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
exports.KClientJSContext = KClientJSContext;
//# sourceMappingURL=kclient-js-context.js.map