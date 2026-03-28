"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorFilter = exports.UserAgentFilter = exports.ProxyFilter = exports.IsBotFilter = exports.IspFilter = exports.ConnectionTypeFilter = exports.LanguageFilter = exports.BrowserVersionFilter = exports.BrowserFilter = exports.OsFilter = exports.DeviceTypeFilter = exports.ReferrerFilter = exports.SourceFilter = exports.KeywordFilter = exports.IpFilter = exports.CityFilter = exports.RegionFilter = exports.CountryFilter = exports.checkFilters = exports.FilterEngine = exports.FilterGroup = exports.AbstractFilter = exports.FilterMode = exports.StreamFilter = void 0;
exports.createAllFilters = createAllFilters;
/**
 * Filter Index
 *
 * Exports all filter-related classes and utilities.
 */
var stream_filter_js_1 = require("./stream-filter.js");
Object.defineProperty(exports, "StreamFilter", { enumerable: true, get: function () { return stream_filter_js_1.StreamFilter; } });
Object.defineProperty(exports, "FilterMode", { enumerable: true, get: function () { return stream_filter_js_1.FilterMode; } });
var filter_interface_js_1 = require("./filter-interface.js");
Object.defineProperty(exports, "AbstractFilter", { enumerable: true, get: function () { return filter_interface_js_1.AbstractFilter; } });
Object.defineProperty(exports, "FilterGroup", { enumerable: true, get: function () { return filter_interface_js_1.FilterGroup; } });
var filter_engine_js_1 = require("./filter-engine.js");
Object.defineProperty(exports, "FilterEngine", { enumerable: true, get: function () { return filter_engine_js_1.FilterEngine; } });
Object.defineProperty(exports, "checkFilters", { enumerable: true, get: function () { return filter_engine_js_1.checkFilters; } });
// Individual filters
var geo_filters_js_1 = require("./geo-filters.js");
Object.defineProperty(exports, "CountryFilter", { enumerable: true, get: function () { return geo_filters_js_1.CountryFilter; } });
Object.defineProperty(exports, "RegionFilter", { enumerable: true, get: function () { return geo_filters_js_1.RegionFilter; } });
Object.defineProperty(exports, "CityFilter", { enumerable: true, get: function () { return geo_filters_js_1.CityFilter; } });
var ip_filter_js_1 = require("./ip-filter.js");
Object.defineProperty(exports, "IpFilter", { enumerable: true, get: function () { return ip_filter_js_1.IpFilter; } });
var traffic_filters_js_1 = require("./traffic-filters.js");
Object.defineProperty(exports, "KeywordFilter", { enumerable: true, get: function () { return traffic_filters_js_1.KeywordFilter; } });
Object.defineProperty(exports, "SourceFilter", { enumerable: true, get: function () { return traffic_filters_js_1.SourceFilter; } });
Object.defineProperty(exports, "ReferrerFilter", { enumerable: true, get: function () { return traffic_filters_js_1.ReferrerFilter; } });
var device_filters_js_1 = require("./device-filters.js");
Object.defineProperty(exports, "DeviceTypeFilter", { enumerable: true, get: function () { return device_filters_js_1.DeviceTypeFilter; } });
Object.defineProperty(exports, "OsFilter", { enumerable: true, get: function () { return device_filters_js_1.OsFilter; } });
Object.defineProperty(exports, "BrowserFilter", { enumerable: true, get: function () { return device_filters_js_1.BrowserFilter; } });
Object.defineProperty(exports, "BrowserVersionFilter", { enumerable: true, get: function () { return device_filters_js_1.BrowserVersionFilter; } });
Object.defineProperty(exports, "LanguageFilter", { enumerable: true, get: function () { return device_filters_js_1.LanguageFilter; } });
Object.defineProperty(exports, "ConnectionTypeFilter", { enumerable: true, get: function () { return device_filters_js_1.ConnectionTypeFilter; } });
Object.defineProperty(exports, "IspFilter", { enumerable: true, get: function () { return device_filters_js_1.IspFilter; } });
var bot_filter_js_1 = require("./bot-filter.js");
Object.defineProperty(exports, "IsBotFilter", { enumerable: true, get: function () { return bot_filter_js_1.IsBotFilter; } });
Object.defineProperty(exports, "ProxyFilter", { enumerable: true, get: function () { return bot_filter_js_1.ProxyFilter; } });
Object.defineProperty(exports, "UserAgentFilter", { enumerable: true, get: function () { return bot_filter_js_1.UserAgentFilter; } });
Object.defineProperty(exports, "OperatorFilter", { enumerable: true, get: function () { return bot_filter_js_1.OperatorFilter; } });
const geo_filters_js_2 = require("./geo-filters.js");
const ip_filter_js_2 = require("./ip-filter.js");
const traffic_filters_js_2 = require("./traffic-filters.js");
const device_filters_js_2 = require("./device-filters.js");
const bot_filter_js_2 = require("./bot-filter.js");
/**
 * Create all built-in filters
 */
function createAllFilters() {
    const filters = new Map();
    // Geo filters
    filters.set('country', new geo_filters_js_2.CountryFilter());
    filters.set('region', new geo_filters_js_2.RegionFilter());
    filters.set('city', new geo_filters_js_2.CityFilter());
    filters.set('ip', new ip_filter_js_2.IpFilter());
    filters.set('isp', new device_filters_js_2.IspFilter());
    filters.set('operator', new bot_filter_js_2.OperatorFilter());
    // Device filters
    filters.set('device_type', new device_filters_js_2.DeviceTypeFilter());
    filters.set('os', new device_filters_js_2.OsFilter());
    filters.set('browser', new device_filters_js_2.BrowserFilter());
    filters.set('browser_version', new device_filters_js_2.BrowserVersionFilter());
    filters.set('language', new device_filters_js_2.LanguageFilter());
    filters.set('connection_type', new device_filters_js_2.ConnectionTypeFilter());
    // Bot/proxy filters
    filters.set('is_bot', new bot_filter_js_2.IsBotFilter());
    filters.set('is_using_proxy', new bot_filter_js_2.ProxyFilter());
    filters.set('user_agent', new bot_filter_js_2.UserAgentFilter());
    // Traffic filters
    filters.set('keyword', new traffic_filters_js_2.KeywordFilter());
    filters.set('source', new traffic_filters_js_2.SourceFilter());
    filters.set('referrer', new traffic_filters_js_2.ReferrerFilter());
    return filters;
}
//# sourceMappingURL=index.js.map