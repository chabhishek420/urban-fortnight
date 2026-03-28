"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferrerFilter = exports.SourceFilter = exports.KeywordFilter = void 0;
/**
 * Keyword Filter
 *
 * Filters clicks based on keyword/search term.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Keyword.php (implied)
 */
const filter_interface_js_1 = require("./filter-interface.js");
const stream_filter_js_1 = require("./stream-filter.js");
/**
 * Empty query values
 */
const EMPTY_QUERIES = ['', 'null', 'undefined', 'empty'];
class KeywordFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'keyword';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.TRAFFIC;
    }
    getTooltip() {
        return 'Filter by keyword or search term';
    }
    isPass(filter, rawClick) {
        const keyword = rawClick.getKeyword()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueLower = value.toLowerCase();
            // Check for empty match
            if (EMPTY_QUERIES.includes(value) && keyword === '') {
                found = true;
                break;
            }
            // Check for contains match
            if (keyword.includes(valueLower)) {
                found = true;
                break;
            }
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.KeywordFilter = KeywordFilter;
/**
 * Source Filter
 *
 * Filters clicks based on traffic source.
 */
class SourceFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'source';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.TRAFFIC;
    }
    isPass(filter, rawClick) {
        const source = rawClick.getSource()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueLower = value.toLowerCase();
            if (EMPTY_QUERIES.includes(value) && source === '') {
                found = true;
                break;
            }
            if (source === valueLower || source.includes(valueLower)) {
                found = true;
                break;
            }
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.SourceFilter = SourceFilter;
/**
 * Referrer Filter
 *
 * Filters clicks based on referrer.
 */
class ReferrerFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'referrer';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.TRAFFIC;
    }
    isPass(filter, rawClick) {
        const referrer = rawClick.getReferrer()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueLower = value.toLowerCase();
            if (EMPTY_QUERIES.includes(value) && referrer === '') {
                found = true;
                break;
            }
            if (referrer.includes(valueLower)) {
                found = true;
                break;
            }
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.ReferrerFilter = ReferrerFilter;
//# sourceMappingURL=traffic-filters.js.map