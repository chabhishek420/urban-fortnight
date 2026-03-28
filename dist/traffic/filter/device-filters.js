"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IspFilter = exports.ConnectionTypeFilter = exports.LanguageFilter = exports.BrowserVersionFilter = exports.BrowserFilter = exports.OsFilter = exports.DeviceTypeFilter = void 0;
/**
 * Device Filters
 *
 * Filters clicks based on device characteristics.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/
 */
const filter_interface_js_1 = require("./filter-interface.js");
const stream_filter_js_1 = require("./stream-filter.js");
/**
 * Device Type Filter
 */
class DeviceTypeFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'device_type';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const deviceType = rawClick.getDeviceType()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => deviceType === value.toLowerCase());
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.DeviceTypeFilter = DeviceTypeFilter;
/**
 * OS Filter
 */
class OsFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'os';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const os = rawClick.getOs()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => os.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.OsFilter = OsFilter;
/**
 * Browser Filter
 */
class BrowserFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'browser';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const browser = rawClick.getBrowser()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => browser.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.BrowserFilter = BrowserFilter;
/**
 * Browser Version Filter
 */
class BrowserVersionFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'browser_version';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const browserVersion = rawClick.getBrowserVersion() ?? '';
        const payload = filter.getPayload();
        if (!payload || !browserVersion) {
            return true;
        }
        const version = parseFloat(browserVersion);
        const minVersion = payload.min ? parseFloat(payload.min) : null;
        const maxVersion = payload.max ? parseFloat(payload.max) : null;
        if (minVersion !== null && version < minVersion) {
            return filter.getMode() === stream_filter_js_1.FilterMode.REJECT;
        }
        if (maxVersion !== null && version > maxVersion) {
            return filter.getMode() === stream_filter_js_1.FilterMode.REJECT;
        }
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT;
    }
}
exports.BrowserVersionFilter = BrowserVersionFilter;
/**
 * Language Filter
 */
class LanguageFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'language';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const language = rawClick.getLanguage()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => language.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.LanguageFilter = LanguageFilter;
/**
 * Connection Type Filter
 */
class ConnectionTypeFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'connection_type';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.DEVICE;
    }
    isPass(filter, rawClick) {
        const connectionType = rawClick.getConnectionType()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => connectionType === value.toLowerCase());
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.ConnectionTypeFilter = ConnectionTypeFilter;
/**
 * ISP Filter
 */
class IspFilter extends filter_interface_js_1.AbstractFilter {
    getKey() {
        return 'isp';
    }
    getGroup() {
        return filter_interface_js_1.FilterGroup.GEO;
    }
    isPass(filter, rawClick) {
        const isp = rawClick.getIsp()?.toLowerCase() ?? '';
        const payload = filter.getPayload();
        if (!Array.isArray(payload)) {
            return true;
        }
        const found = payload.some(value => isp.includes(value.toLowerCase()));
        return filter.getMode() === stream_filter_js_1.FilterMode.ACCEPT ? found : !found;
    }
}
exports.IspFilter = IspFilter;
//# sourceMappingURL=device-filters.js.map