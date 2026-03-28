"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trigger = exports.TriggerAction = exports.TriggerCondition = exports.TriggerTarget = void 0;
/**
 * Trigger Model
 *
 * Represents a monitoring trigger in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Trigger.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
/**
 * Trigger target constants
 */
exports.TriggerTarget = {
    OFFER: 'offer',
    LANDING: 'landing'
};
/**
 * Trigger condition constants
 */
exports.TriggerCondition = {
    CONTAINS_TEXT: 'contains_text',
    NOT_CONTAINS_TEXT: 'not_contains_text',
    HTTP_STATUS: 'http_status',
    RESPONSE_TIME: 'response_time',
    REDIRECT_LOOP: 'redirect_loop',
    SSL_ERROR: 'ssl_error',
    TIMEOUT: 'timeout',
    REGEX_MATCH: 'regex_match'
};
/**
 * Trigger action constants
 */
exports.TriggerAction = {
    DISABLE: 'disable',
    NOTIFY: 'notify',
    SWITCH_TO_ALTERNATIVE: 'switch_to_alternative',
    ENABLE: 'enable'
};
/**
 * Trigger model class
 */
class Trigger extends abstract_model_js_1.AbstractModel {
    static _tableName = 'triggers';
    static _cacheKey = 'TRIGGERS';
    static _aclKey = 'triggers';
    static _entityName = 'trigger';
    // === Getters ===
    getStreamId() {
        return this.get('stream_id') ?? 0;
    }
    getTarget() {
        const target = this.get('target');
        return target ?? exports.TriggerTarget.OFFER;
    }
    getCondition() {
        const condition = this.get('condition');
        return condition ?? exports.TriggerCondition.CONTAINS_TEXT;
    }
    getSelectedPage() {
        return this.get('selected_page');
    }
    getPattern() {
        return this.get('pattern');
    }
    getAction() {
        const action = this.get('action');
        return action ?? exports.TriggerAction.NOTIFY;
    }
    getInterval() {
        return this.get('interval') ?? 300; // Default 5 minutes
    }
    getNextRunAt() {
        return this.get('next_run_at');
    }
    getAlternativeUrls() {
        const urls = this.get('alternative_urls');
        if (!urls)
            return undefined;
        try {
            return JSON.parse(urls);
        }
        catch {
            return urls.split('\n').filter(u => u.trim().length > 0);
        }
    }
    getGrabFromPage() {
        return this.get('grab_from_page');
    }
    getAvSettings() {
        const settings = this.get('av_settings');
        if (!settings)
            return undefined;
        try {
            return JSON.parse(settings);
        }
        catch {
            return undefined;
        }
    }
    isReverse() {
        return this.get('reverse') === 1;
    }
    isEnabled() {
        return this.get('enabled') === 1;
    }
    getScanPage() {
        return this.get('scan_page') === 1;
    }
    // === Target checks ===
    isOfferTarget() {
        return this.getTarget() === exports.TriggerTarget.OFFER;
    }
    isLandingTarget() {
        return this.getTarget() === exports.TriggerTarget.LANDING;
    }
    // === Condition checks ===
    isContainsTextCondition() {
        return this.getCondition() === exports.TriggerCondition.CONTAINS_TEXT;
    }
    isNotContainsTextCondition() {
        return this.getCondition() === exports.TriggerCondition.NOT_CONTAINS_TEXT;
    }
    isHttpStatusCondition() {
        return this.getCondition() === exports.TriggerCondition.HTTP_STATUS;
    }
    isResponseTimeCondition() {
        return this.getCondition() === exports.TriggerCondition.RESPONSE_TIME;
    }
    isRedirectLoopCondition() {
        return this.getCondition() === exports.TriggerCondition.REDIRECT_LOOP;
    }
    isSslErrorCondition() {
        return this.getCondition() === exports.TriggerCondition.SSL_ERROR;
    }
    isTimeoutCondition() {
        return this.getCondition() === exports.TriggerCondition.TIMEOUT;
    }
    isRegexMatchCondition() {
        return this.getCondition() === exports.TriggerCondition.REGEX_MATCH;
    }
    // === Action checks ===
    isDisableAction() {
        return this.getAction() === exports.TriggerAction.DISABLE;
    }
    isNotifyAction() {
        return this.getAction() === exports.TriggerAction.NOTIFY;
    }
    isSwitchToAlternativeAction() {
        return this.getAction() === exports.TriggerAction.SWITCH_TO_ALTERNATIVE;
    }
    isEnableAction() {
        return this.getAction() === exports.TriggerAction.ENABLE;
    }
    // === Setters ===
    setStreamId(value) {
        return this.set('stream_id', value);
    }
    setTarget(value) {
        return this.set('target', value);
    }
    setCondition(value) {
        return this.set('condition', value);
    }
    setPattern(value) {
        return this.set('pattern', value);
    }
    setAction(value) {
        return this.set('action', value);
    }
    setInterval(value) {
        return this.set('interval', value);
    }
    setNextRunAt(value) {
        return this.set('next_run_at', value);
    }
    setEnabled(value) {
        return this.set('enabled', value ? 1 : 0);
    }
    setReverse(value) {
        return this.set('reverse', value ? 1 : 0);
    }
    setAlternativeUrls(value) {
        return this.set('alternative_urls', JSON.stringify(value));
    }
}
exports.Trigger = Trigger;
//# sourceMappingURL=trigger.js.map