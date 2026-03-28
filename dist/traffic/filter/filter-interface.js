"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFilter = exports.FilterGroup = void 0;
/**
 * Filter group constants
 */
exports.FilterGroup = {
    GEO: 'filters.groups.geo',
    DEVICE: 'filters.groups.device',
    TRAFFIC: 'filters.groups.traffic',
    SCHEDULE: 'filters.groups.schedule',
    LIMITS: 'filters.groups.limits'
};
/**
 * Abstract base class for filters
 */
class AbstractFilter {
    _serverRequest = null;
    _logger = null;
    getTooltip() {
        return '';
    }
    setServerRequest(request) {
        this._serverRequest = request;
    }
    setLogger(logger) {
        this._logger = logger;
    }
    /**
     * Log a debug message
     */
    log(message) {
        if (this._logger) {
            this._logger.add(message);
        }
    }
}
exports.AbstractFilter = AbstractFilter;
//# sourceMappingURL=filter-interface.js.map