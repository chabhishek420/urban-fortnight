"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTokensDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
class UpdateTokensDispatcher {
    /**
     * Dispatch token update request
     */
    dispatch(request) {
        const response = new response_js_1.Response({
            disableCache: true
        });
        // Check for sub_id
        if (!request.hasParam('sub_id')) {
            return new response_js_1.Response({
                status: status_code_js_1.StatusCode.BAD_REQUEST,
                body: `[UpdateTokens] SubId is empty in : ${JSON.stringify(request.getQueryParams())}`
            });
        }
        const subId = request.getParam('sub_id');
        const params = request.getQueryParams();
        // Update tokens
        this.updateTokens(subId ?? '', params);
        return response;
    }
    /**
     * Update tokens for a click
     */
    updateTokens(subId, params) {
        // In production: UpdateClickCommand::updateTokens(subId, params)
        console.log(`[UpdateTokens] Updating tokens for sub_id: ${subId}`, params);
    }
}
exports.UpdateTokensDispatcher = UpdateTokensDispatcher;
//# sourceMappingURL=update-tokens-dispatcher.js.map