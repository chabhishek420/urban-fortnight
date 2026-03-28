"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KtrkDispatcher = void 0;
/**
 * KTRK Dispatcher (JSONP Tracking)
 *
 * Handles JSONP-based tracking requests.
 * Returns JavaScript responses for cross-domain tracking.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/KtrkDispatcher.php
 */
const click_api_dispatcher_js_1 = require("./click-api-dispatcher.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
class KtrkDispatcher extends click_api_dispatcher_js_1.ClickApiDispatcher {
    constructor(payload, version = 2) {
        super(payload, version);
    }
    /**
     * Dispatch and return JSONP response
     */
    dispatch(request) {
        const response = super.dispatch(request);
        if (!response) {
            throw new Error('Empty response');
        }
        // Only modify successful responses
        if (response.getStatus() !== status_code_js_1.StatusCode.OK) {
            return response;
        }
        // Get raw click data for JSONP response
        const rawClick = this.getPipelinePayload().getRawClick();
        const jsonData = {
            sub_id: rawClick?.getSubId() ?? '',
            token: rawClick?.get('token') ?? ''
        };
        const json = JSON.stringify(jsonData);
        const jsCode = `KTracking.response(${json});`;
        return response
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.JAVASCRIPT)
            .withBody(jsCode);
    }
}
exports.KtrkDispatcher = KtrkDispatcher;
//# sourceMappingURL=ktrk-dispatcher.js.map