"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterEngine = void 0;
exports.checkFilters = checkFilters;
/**
 * Filter Engine class
 */
class FilterEngine {
    _serverRequest;
    _stream;
    _rawClick;
    _logger;
    _filterRegistry = new Map();
    constructor(options) {
        this._serverRequest = options.serverRequest;
        this._stream = options.stream;
        this._rawClick = options.rawClick;
        this._logger = options.logger ?? { add: () => { } };
    }
    /**
     * Register a filter implementation
     */
    registerFilter(name, filter) {
        this._filterRegistry.set(name, filter);
    }
    /**
     * Get a registered filter
     */
    getFilter(name) {
        return this._filterRegistry.get(name);
    }
    /**
     * Check if all filters pass
     */
    isPass(filters) {
        this._logger.add(`Checking stream #${this._stream.getId() ?? 'unknown'}`);
        if (filters.length === 0) {
            this._logger.add('Stream contains no filters. Passed.');
            return true;
        }
        const blockedOrFilters = [];
        const isFilterOr = this._stream.isFilterOr();
        for (const filterData of filters) {
            const filter = this._filterRegistry.get(filterData.getName());
            if (!filter) {
                this._logger.add(`Unknown filter "${filterData.getName()}"`);
                continue;
            }
            filter.setServerRequest(this._serverRequest);
            filter.setLogger(this._logger);
            if (!filter.isPass(filterData, this._rawClick)) {
                if (!isFilterOr) {
                    this._logger.add(`Blocks by filter "${filterData.getName()}". Not passed.`);
                    return false;
                }
                blockedOrFilters.push(filter.getKey());
            }
            else {
                if (isFilterOr) {
                    const payload = filterData.getPayload();
                    const msg = payload?.name
                        ? `Accepts by filter "${filterData.getName()}" by parameter name: "${payload.name}". Passed.`
                        : `Accepts by filter "${filterData.getName()}". Passed.`;
                    this._logger.add(msg);
                    return true;
                }
            }
        }
        if (isFilterOr) {
            this._logger.add(`Deny by all the filters: ${blockedOrFilters.join(', ')}. Not passed.`);
            return false;
        }
        this._logger.add('All filters are checked. Passed.');
        return true;
    }
    /**
     * Evaluate a single filter
     */
    evaluateFilter(filterData) {
        const filter = this._filterRegistry.get(filterData.getName());
        if (!filter) {
            return true;
        }
        filter.setServerRequest(this._serverRequest);
        return filter.isPass(filterData, this._rawClick);
    }
}
exports.FilterEngine = FilterEngine;
/**
 * Check filters against a click
 *
 * Convenience function for filter checking
 */
function checkFilters(serverRequest, stream, rawClick, filters, filterImplementations, logger) {
    const engine = new FilterEngine({
        serverRequest,
        stream,
        rawClick,
        logger: logger ?? { add: () => { } }
    });
    // Register all filter implementations
    for (const [name, filter] of filterImplementations) {
        engine.registerFilter(name, filter);
    }
    return engine.isPass(filters);
}
//# sourceMappingURL=filter-engine.js.map