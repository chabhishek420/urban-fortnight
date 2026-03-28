"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickApiDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
class ClickApiDispatcher {
    _version;
    _pipelinePayload;
    constructor(payload, version = 1) {
        this._pipelinePayload = payload;
        this._version = version;
    }
    /**
     * Set API version
     */
    setVersion(version) {
        this._version = version;
    }
    /**
     * Get pipeline payload
     */
    getPipelinePayload() {
        return this._pipelinePayload;
    }
    /**
     * Dispatch the API request
     */
    dispatch(request) {
        const payload = this.getPipelinePayload();
        payload.setResponse(response_js_1.Response.build());
        try {
            // In production: Run pipeline stages
            // const pipeline = new Pipeline();
            // pipeline.firstLevelStages();
            // pipelinePayload = pipeline.start(pipelinePayload, logEntry);
            // Generate response based on version
            switch (this._version) {
                case 1:
                    return this.buildVersion1Response(payload, request);
                case 2:
                    return this.buildVersion2Response(payload, request);
                case 3:
                    return this.buildVersion3Response(payload, request);
                default:
                    return this.buildErrorResponse(403, `Unimplemented API version: ${this._version}`);
            }
        }
        catch (e) {
            const error = e;
            return this.buildErrorResponse(500, error.message);
        }
    }
    /**
     * Build version 1 response
     */
    buildVersion1Response(payload, _request) {
        const json = {};
        const stream = payload.getStream();
        if (stream) {
            json['stream'] = {
                id: stream.getId?.() ?? null,
                url: payload.getActionPayload(),
                type: payload.getActionType(),
                campaign_id: payload.getCampaign()?.getId?.() ?? null
            };
        }
        const response = payload.getResponse();
        if (response) {
            const filteredHeaders = { ...response.getHeaders() };
            delete filteredHeaders['Set-Cookie'];
            delete filteredHeaders[content_type_js_1.ContentType.HEADER];
            json['redirect'] = {
                headers: this.headersToList(filteredHeaders),
                content: response.getBody()?.toString() ?? ''
            };
        }
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.OK,
            body: json
        });
    }
    /**
     * Build version 2 response
     */
    buildVersion2Response(payload, _request) {
        const serverRequest = payload.getServerRequest();
        const response = payload.getResponse();
        const contentType = response?.getHeader(content_type_js_1.ContentType.HEADER)?.[0] ?? '';
        const filteredHeaders = response ? { ...response.getHeaders() } : {};
        delete filteredHeaders['Set-Cookie'];
        delete filteredHeaders[content_type_js_1.ContentType.HEADER];
        const rawClick = payload.getRawClick();
        const json = {
            body: response?.getBody()?.toString() ?? '',
            headers: this.headersToList(filteredHeaders),
            status: response?.getStatus() ?? status_code_js_1.StatusCode.OK,
            contentType,
            uniqueness_cookie: serverRequest.getCookie('keitaro_visitor') ?? ''
        };
        // Add info if requested
        if (serverRequest.getParam('info')) {
            json['info'] = {
                type: payload.getActionType(),
                url: payload.getActionPayload(),
                campaign_id: rawClick?.getCampaignId() ?? null,
                stream_id: rawClick?.getStreamId() ?? null,
                landing_id: rawClick?.getLandingId() ?? null,
                sub_id: rawClick?.getSubId() ?? '',
                is_bot: rawClick?.isBot() ?? false,
                offer_id: rawClick?.getOfferId() ?? null,
                token: rawClick?.get('token') ?? '',
                uniqueness: {
                    campaign: rawClick?.isUniqueCampaign() ?? false,
                    stream: rawClick?.isUniqueStream() ?? false,
                    global: rawClick?.isUniqueGlobal() ?? false
                }
            };
        }
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.OK,
            body: json
        });
    }
    /**
     * Build version 3 response
     */
    buildVersion3Response(payload, request) {
        const serverRequest = payload.getServerRequest();
        const json = this.buildVersion2Json(payload, request);
        const campaign = payload.getCampaign();
        if (campaign) {
            json['cookies_ttl'] = campaign.getCookiesTtl();
        }
        json['cookies'] = serverRequest.getCookies();
        // Include log if requested
        if (serverRequest.getParam('log')) {
            json['log'] = ''; // In production: logEntry.flush()
        }
        return response_js_1.Response.buildJson({
            status: status_code_js_1.StatusCode.OK,
            body: json
        });
    }
    /**
     * Build version 2 JSON data (helper for v3)
     */
    buildVersion2Json(payload, _request) {
        const serverRequest = payload.getServerRequest();
        const response = payload.getResponse();
        const contentType = response?.getHeader(content_type_js_1.ContentType.HEADER)?.[0] ?? '';
        const filteredHeaders = response ? { ...response.getHeaders() } : {};
        delete filteredHeaders['Set-Cookie'];
        delete filteredHeaders[content_type_js_1.ContentType.HEADER];
        const rawClick = payload.getRawClick();
        const json = {
            body: response?.getBody()?.toString() ?? '',
            headers: this.headersToList(filteredHeaders),
            status: response?.getStatus() ?? status_code_js_1.StatusCode.OK,
            contentType,
            uniqueness_cookie: serverRequest.getCookie('keitaro_visitor') ?? ''
        };
        if (serverRequest.getParam('info')) {
            json['info'] = {
                type: payload.getActionType(),
                url: payload.getActionPayload(),
                campaign_id: rawClick?.getCampaignId() ?? null,
                stream_id: rawClick?.getStreamId() ?? null,
                landing_id: rawClick?.getLandingId() ?? null,
                sub_id: rawClick?.getSubId() ?? '',
                is_bot: rawClick?.isBot() ?? false,
                offer_id: rawClick?.getOfferId() ?? null,
                token: rawClick?.get('token') ?? '',
                uniqueness: {
                    campaign: rawClick?.isUniqueCampaign() ?? false,
                    stream: rawClick?.isUniqueStream() ?? false,
                    global: rawClick?.isUniqueGlobal() ?? false
                }
            };
        }
        return json;
    }
    /**
     * Convert headers to list format
     */
    headersToList(headers) {
        const result = [];
        for (const [name, values] of Object.entries(headers)) {
            for (const value of values) {
                result.push([name, value]);
            }
        }
        return result;
    }
    /**
     * Build error response
     */
    buildErrorResponse(status, error) {
        return response_js_1.Response.buildJson({
            status,
            body: { error }
        });
    }
}
exports.ClickApiDispatcher = ClickApiDispatcher;
//# sourceMappingURL=click-api-dispatcher.js.map