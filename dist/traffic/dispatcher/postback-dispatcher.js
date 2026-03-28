"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostbackDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const content_type_js_1 = require("../response/content-type.js");
/**
 * 1x1 transparent GIF pixel
 */
const PIXEL = 'R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==';
class PostbackDispatcher {
    static JSONP = 'jsonp';
    static GIF = 'gif';
    /**
     * Dispatch the postback request
     */
    dispatch(request) {
        const response = new response_js_1.Response({
            disableCache: true
        });
        const key = this.findKey(request);
        const modifiedRequest = this.convertCustomHeaders(request);
        // Log postback
        this.log(`Received postback ${modifiedRequest.getUri().toString()}`);
        // Validate postback key
        if (!this.isKeyValid(key)) {
            const message = `Incorrect postback code (${key})`;
            this.log(message);
            return this.updateBody(response, message, modifiedRequest.getParam('return'));
        }
        try {
            // Build postback from params
            const postback = this.buildPostbackFromParams(modifiedRequest);
            // Try to get sub_id from cookies if not provided
            if (!postback.subId) {
                const cookieSubId = modifiedRequest.getCookie('sub_id');
                if (cookieSubId) {
                    postback.subId = cookieSubId;
                }
            }
            if (!postback.subId) {
                this.log(`Incorrect subid "${postback.subId}". Postback ignored.`);
                return this.updateBody(response, 'Incorrect subid', modifiedRequest.getParam('return'));
            }
            // Process postback
            this.processPostback(postback);
            this.log(`Using "${postback.subId}" as subid. Postback added to queue.`);
            return this.updateBody(response, 'Success', modifiedRequest.getParam('return'));
        }
        catch (e) {
            const error = e;
            this.log(error.message);
            return this.updateBody(response, error.message, modifiedRequest.getParam('return'));
        }
    }
    /**
     * Log postback message
     */
    log(message) {
        // In production: PostbackLoggerService::instance()->log(message)
        console.log(`[Postback] ${message}`);
    }
    /**
     * Convert custom headers for special integrations
     */
    convertCustomHeaders(request) {
        // In production: Parse special XML bodies for Mosbill integration
        return request;
    }
    /**
     * Find postback key from request
     */
    findKey(request) {
        // Check explicit key param
        const keyParam = request.getParam('k_router_key');
        if (keyParam) {
            return keyParam;
        }
        // Check first query param
        const params = request.getQueryParams();
        const keys = Object.keys(params);
        if (keys.length > 0) {
            return keys[0] ?? null;
        }
        return null;
    }
    /**
     * Validate postback key
     */
    isKeyValid(key) {
        // In production: Compare with NetworkTemplatesRepository secret
        return !!key;
    }
    /**
     * Build postback object from request params
     */
    buildPostbackFromParams(request) {
        const params = request.getQueryParams();
        return {
            subId: params['sub_id'] ?? params['subid'] ?? null,
            sale: params['sale'] ?? params['payout'] ?? null,
            revenue: params['revenue'] ?? params['cost'] ?? null,
            ...params
        };
    }
    /**
     * Process the postback
     */
    processPostback(postback) {
        // In production: ProcessPostbackCommand::processPostback(postback)
        this.log(`Processing postback for sub_id: ${postback.subId}`);
    }
    /**
     * Update response body based on return format
     */
    updateBody(response, message, returnFormat) {
        switch (returnFormat) {
            case PostbackDispatcher.JSONP:
                const jsCode = `KTracking && KTracking.response("${this.escapeHtml(message)}")`;
                return response
                    .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.JAVASCRIPT)
                    .withBody(jsCode);
            case PostbackDispatcher.GIF:
                return response
                    .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.GIF)
                    .withBody(Buffer.from(PIXEL, 'base64'));
            default:
                return response.withBody(message);
        }
    }
    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
exports.PostbackDispatcher = PostbackDispatcher;
//# sourceMappingURL=postback-dispatcher.js.map