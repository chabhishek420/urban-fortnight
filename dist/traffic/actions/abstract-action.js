"use strict";
/**
 * Traffic Actions - Abstract Action Base Class
 *
 * Base class for all stream action implementations.
 * Actions determine how to respond to clicks (redirects, iframes, HTML, etc.)
 *
 * @see keitaro_source/application/Traffic/Actions/AbstractAction.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAction = exports.ActionType = exports.ActionField = void 0;
const content_type_1 = require("../response/content-type");
/**
 * Action field types
 */
var ActionField;
(function (ActionField) {
    ActionField["URL"] = "url";
    ActionField["TEXT"] = "text";
    ActionField["CAMPAIGNS"] = "campaigns";
    ActionField["STREAMS"] = "streams";
    ActionField["NOTHING"] = "nothing";
    ActionField["UPLOAD"] = "upload";
})(ActionField || (exports.ActionField = ActionField = {}));
/**
 * Action type categories
 */
var ActionType;
(function (ActionType) {
    ActionType["REDIRECT"] = "redirect";
    ActionType["OTHER"] = "other";
    ActionType["HIDDEN"] = "hidden";
})(ActionType || (exports.ActionType = ActionType = {}));
/**
 * Abstract Action Base Class
 */
class AbstractAction {
    _name;
    _weight = 1;
    _payload = null;
    constructor(name) {
        this._name = name;
    }
    /**
     * Get action type (redirect, other, hidden)
     */
    getType() {
        return ActionType.REDIRECT;
    }
    /**
     * Get field type for this action
     */
    getField() {
        return ActionField.URL;
    }
    /**
     * Get action name
     */
    getName() {
        return this._name;
    }
    /**
     * Get action weight (for ordering)
     */
    getWeight() {
        return this._weight;
    }
    /**
     * Set pipeline payload
     */
    setPayload(payload) {
        this._payload = payload;
    }
    /**
     * Get pipeline payload
     */
    getPayload() {
        if (!this._payload) {
            throw new Error('Payload not set');
        }
        return this._payload;
    }
    /**
     * Get response from payload
     */
    getResponse() {
        const response = this.getPayload().getResponse();
        if (!response) {
            throw new Error('Response not set');
        }
        return response;
    }
    /**
     * Set response on payload
     */
    setResponse(response) {
        this.getPayload().setResponse(response);
    }
    /**
     * Get raw click from payload
     */
    getRawClick() {
        const click = this.getPayload().getRawClick();
        if (!click) {
            throw new Error('RawClick not set');
        }
        return click;
    }
    /**
     * Get campaign from payload
     */
    getCampaign() {
        return this.getPayload().getCampaign() ?? undefined;
    }
    /**
     * Get stream from payload
     */
    getStream() {
        return this.getPayload().getStream() ?? undefined;
    }
    /**
     * Get landing from payload
     */
    getLanding() {
        return this.getPayload().getLanding() ?? undefined;
    }
    /**
     * Get offer from payload
     */
    getOffer() {
        return this.getPayload().getOffer() ?? undefined;
    }
    /**
     * Get server request from payload
     */
    getServerRequest() {
        return this.getPayload().getServerRequest();
    }
    /**
     * Get raw action payload (before macro processing)
     */
    getRawActionPayload() {
        const payload = this.getPayload().getActionPayload();
        return typeof payload === 'string' ? payload : '';
    }
    /**
     * Get action payload with macros processed
     */
    getActionPayload() {
        return this.processMacros(this.getRawActionPayload());
    }
    /**
     * Get action options
     */
    getActionOptions() {
        const options = this.getPayload().getActionOptions();
        return options ?? {};
    }
    /**
     * Run the action and return modified payload
     */
    run() {
        this.execute();
        return this.getPayload();
    }
    /**
     * Set response status code
     */
    setStatus(status) {
        this.setResponse(this.getResponse().withStatus(status));
    }
    /**
     * Set response header
     */
    setHeader(name, value) {
        this.setResponse(this.getResponse().withHeader(name, value));
    }
    /**
     * Add header from string (e.g., "Content-Type: text/html")
     */
    addHeader(headerString) {
        const parts = headerString.split(':');
        if (parts.length < 2) {
            throw new Error('Header must contain ":"');
        }
        const name = parts[0]?.trim() ?? '';
        const value = parts.slice(1).join(':').trim();
        this.setHeader(name, value);
    }
    /**
     * Set response content type
     */
    setContentType(contentType) {
        this.setHeader(content_type_1.ContentType.HEADER, contentType);
    }
    /**
     * Set response body content
     */
    setContent(content) {
        this.setResponse(this.getResponse().withBody(content));
    }
    /**
     * Set redirect location header
     */
    redirect(url) {
        this.setHeader('Location', url);
        const response = this.getResponse();
        if (response.getStatus() === 200) {
            this.setStatus(302);
        }
    }
    /**
     * Set destination info on click
     */
    setDestinationInfo(value) {
        this.getRawClick().setDestination(value);
    }
    /**
     * Process macros in content
     */
    processMacros(content) {
        // Basic macro substitution - can be extended
        const rawClick = this.getRawClick();
        const campaign = this.getCampaign();
        let result = content;
        // Click macros
        result = result.replace(/{clickid}/gi, rawClick.getSubId() || '');
        result = result.replace(/{subid}/gi, rawClick.getSubId() || '');
        // Campaign macros
        if (campaign) {
            result = result.replace(/{campaign_id}/gi, String(campaign.getId() ?? ''));
            result = result.replace(/{campaign_name}/gi, campaign.getName() ?? '');
        }
        // IP and geo
        result = result.replace(/{ip}/gi, rawClick.getIp() ?? '');
        result = result.replace(/{country}/gi, rawClick.getCountry() ?? '');
        result = result.replace(/{city}/gi, rawClick.getCity() ?? '');
        result = result.replace(/{region}/gi, rawClick.getRegion() ?? '');
        // Device
        result = result.replace(/{device_type}/gi, rawClick.getDeviceType() ?? '');
        result = result.replace(/{browser}/gi, rawClick.getBrowser() ?? '');
        result = result.replace(/{os}/gi, rawClick.getOs() ?? '');
        // Other
        result = result.replace(/{keyword}/gi, rawClick.getKeyword() ?? '');
        result = result.replace(/{referrer}/gi, rawClick.getReferrer() ?? '');
        return result;
    }
    /**
     * Execute in different contexts (default, script, frame)
     */
    executeInContext() {
        const queryParams = this.getServerRequest().getQueryParams();
        for (const [paramName, paramValue] of Object.entries(queryParams)) {
            if (paramName.startsWith('frm')) {
                const from = paramValue;
                if (from.startsWith('script')) {
                    if (from.startsWith('frame')) {
                        this.executeDefault();
                    }
                    else {
                        this.executeForFrame();
                    }
                }
                else {
                    this.executeForScript();
                }
                return;
            }
        }
        this.executeDefault();
    }
    /**
     * Execute for script context
     */
    executeForScript() {
        this.setContentType('application/javascript');
        this.setContent('console.error("Action incompatible with script context");');
    }
    /**
     * Execute for frame context
     */
    executeForFrame() {
        this.setContentType('text/html');
        this.setContent('<script>console.error("Action incompatible with frame context");</script>');
    }
    /**
     * Execute default - must be implemented by subclasses
     */
    executeDefault() {
        this.setContent(`Error: executeDefault() must be implemented in ${this._name}`);
    }
}
exports.AbstractAction = AbstractAction;
//# sourceMappingURL=abstract-action.js.map