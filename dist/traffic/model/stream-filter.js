"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamFilter = exports.FilterName = exports.FilterMode = void 0;
/**
 * Stream Filter Model
 *
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */
const abstract_model_js_1 = require("../../core/model/abstract-model.js");
/**
 * Filter mode constants
 */
exports.FilterMode = {
    ACCEPT: 'accept',
    REJECT: 'reject'
};
/**
 * Filter name constants
 */
exports.FilterName = {
    COUNTRY: 'country',
    REGION: 'region',
    CITY: 'city',
    IP: 'ip',
    KEYWORD: 'keyword',
    USER_AGENT: 'user_agent',
    DEVICE: 'device_type',
    OS: 'os',
    BROWSER: 'browser',
    LANGUAGE: 'language',
    REFERER: 'referer',
    SCHEDULE: 'schedule',
    LIMIT: 'limit',
    ISP: 'isp',
    CONNECTION_TYPE: 'connection_type'
};
class StreamFilter extends abstract_model_js_1.AbstractModel {
    static _tableName = 'stream_filters';
    static _cacheKey = 'STREAM_FILTERS';
    static _entityName = 'stream_filter';
    getStreamId() {
        return this.get('stream_id') ?? 0;
    }
    getName() {
        return (this.get('name') ?? exports.FilterName.IP);
    }
    getMode() {
        return (this.get('mode') ?? exports.FilterMode.ACCEPT);
    }
    getPayload() {
        const payload = this.get('payload');
        if (!payload)
            return null;
        try {
            return JSON.parse(payload);
        }
        catch {
            return payload;
        }
    }
    isAcceptMode() {
        return this.getMode() === exports.FilterMode.ACCEPT;
    }
    isRejectMode() {
        return this.getMode() === exports.FilterMode.REJECT;
    }
    /**
     * Check if this filter matches the given context
     */
    matches(context) {
        const name = this.getName();
        const payload = this.getPayload();
        // Get the value to check from context
        const contextValue = context[name];
        if (contextValue === undefined) {
            return false;
        }
        // Payload is an array of values to match against
        if (Array.isArray(payload)) {
            const matchFound = payload.some(item => {
                if (typeof item === 'string') {
                    return String(contextValue).toLowerCase() === item.toLowerCase();
                }
                return contextValue === item;
            });
            return matchFound;
        }
        // Single value match
        if (typeof payload === 'string') {
            return String(contextValue).toLowerCase() === payload.toLowerCase();
        }
        return contextValue === payload;
    }
}
exports.StreamFilter = StreamFilter;
//# sourceMappingURL=stream-filter.js.map