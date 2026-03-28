"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPrefetchStage = void 0;
const stage_interface_js_1 = require("../../../core/pipeline/stage-interface.js");
const response_js_1 = require("../../response/response.js");
const status_code_js_1 = require("../../response/status-code.js");
/**
 * Prefetch detection headers
 */
const PREFETCH_HEADERS = {
    'X-PURPOSE': 'preview',
    'X-MOZ': 'prefetch',
    'X-FB-HTTP-ENGINE': 'Liger'
};
/**
 * Check Prefetch Stage - blocks prefetch requests
 */
class CheckPrefetchStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const request = payload.getServerRequest();
        if (!request) {
            throw new stage_interface_js_1.StageException('Empty request', 'CheckPrefetchStage');
        }
        // Check if prefetch ignoring is enabled
        // @artifact ARTIFACT-006: Simplified settings check
        const ignorePrefetch = this._getIgnorePrefetchSetting();
        if (!ignorePrefetch) {
            return payload;
        }
        // Check for prefetch detection
        if (this._isPrefetchDetected(request) ||
            (request.getParam('version') && request.getParam('prefetch'))) {
            logEntry.add('Ignored because prefetch is detected');
            const response = new response_js_1.Response()
                .withStatus(status_code_js_1.StatusCode.FORBIDDEN)
                .withBody('Prefetch not allowed');
            payload.setResponse(response);
            payload.abort();
        }
        return payload;
    }
    /**
     * Check if prefetch should be ignored
     */
    _getIgnorePrefetchSetting() {
        // In original: CachedSettingsRepository.instance().get("ingore_prefetch")
        // Default to true for safety
        return true;
    }
    /**
     * Detect if request is a prefetch
     */
    _isPrefetchDetected(request) {
        for (const [name, value] of Object.entries(PREFETCH_HEADERS)) {
            const headerValue = request.getHeader(name);
            if (headerValue === value) {
                return true;
            }
        }
        return false;
    }
}
exports.CheckPrefetchStage = CheckPrefetchStage;
//# sourceMappingURL=check-prefetch-stage.js.map