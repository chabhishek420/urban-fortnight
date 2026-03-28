"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorFilter = exports.UserAgentFilter = exports.ProxyFilter = exports.IsBotFilter = void 0;
/**
 * Bot Filter
 *
 * Filters clicks based on bot detection.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/IsBot.php
 */
const filter_interface_js_1 = require("./filter-interface.js");
const stream_filter_js_1 = require("./stream-filter.js");
/**
 * Is Bot Filter
 */
class IsBotFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'is_bot';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    getTooltip() {
        return 'Filter visitors identified as bots';
    }
    isPass(filter, rawClick) {
        const isBot = rawClick.isBot();
        if (filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT) {
            return isBot;
        }
        else {
            return !isBot;
        }
    }
}
exports.IsBotFilter = IsBotFilter;
/**
 * Proxy Filter
 *
 * Filters clicks based on proxy detection.
 */
class ProxyFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'is_using_proxy';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    getTooltip() {
        return 'Filter visitors using proxy/VPN';
    }
    isPass(filter, rawClick) {
        const isProxy = rawClick.isProxy();
        if (filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT) {
            return isProxy;
        }
        else {
            return !isProxy;
        }
    }
}
exports.ProxyFilter = ProxyFilter;
/**
 * User Agent Filter
 *
 * Filters clicks based on user agent string.
 */
class UserAgentFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'user_agent';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const userAgent = rawClick.getUserAgent()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload) || !userAgent) {
            return true;
        }
        const found = payload.some(value => userAgent.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.UserAgentFilter = UserAgentFilter;
/**
 * Operator Filter
 *
 * Filters clicks based on mobile carrier/operator.
 */
class OperatorFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'operator';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    isPass(filter, rawClick) {
        const operator = rawClick.get('operator')?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => operator.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.OperatorFilter = OperatorFilter;
//# sourceMappingURL=bot-filter.js.map