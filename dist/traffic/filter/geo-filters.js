"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityFilter = exports.RegionFilter = exports.CountryFilter = void 0;
/**
 * Country Filter
 *
 * Filters clicks based on country code.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Country.php
 */
const filter_interface_js_1 = require("./filter-interface.js");
const stream_filter_js_1 = require("./stream-filter.js");
/**
 * Empty query values that match missing data
 */
const EMPTY_QUERIES = ['', 'null', 'undefined', 'empty'];
class CountryFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'country';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    isPass(filter, rawClick) {
        const country = rawClick.getCountry()?.toUpperCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueUpper = value.toUpperCase();
            // Check for empty value match
            if (EMPTY_QUERIES.includes(value) && country === '') {
                found = true;
                break;
            }
            // Check for exact country match
            if (country === valueUpper) {
                found = true;
                break;
            }
        }
        // Return based on mode
        if (filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT) {
            return found;
        }
        else {
            return !found;
        }
    }
}
exports.CountryFilter = CountryFilter;
/**
 * Region Filter
 *
 * Filters clicks based on region/state.
 */
class RegionFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'region';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    isPass(filter, rawClick) {
        const region = rawClick.getRegion()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueLower = value.toLowerCase();
            if (EMPTY_QUERIES.includes(value) && region === '') {
                found = true;
                break;
            }
            if (region === valueLower || region.includes(valueLower)) {
                found = true;
                break;
            }
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.RegionFilter = RegionFilter;
/**
 * City Filter
 *
 * Filters clicks based on city.
 */
class CityFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'city';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    isPass(filter, rawClick) {
        const city = rawClick.getCity()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        let found = false;
        for (const value of payload) {
            const valueLower = value.toLowerCase();
            if (EMPTY_QUERIES.includes(value) && city === '') {
                found = true;
                break;
            }
            if (city === valueLower || city.includes(valueLower)) {
                found = true;
                break;
            }
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.CityFilter = CityFilter;
//# sourceMappingURL=geo-filters.js.map