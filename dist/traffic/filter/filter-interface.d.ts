/**
 * Filter Interface
 *
 * Base interface for all stream filters.
 *
 * @see keitaro_source/application/Core/Filter/AbstractFilter.php
 */
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
import type { ServerRequest } from '../request/server-request.js';
/**
 * Filter group constants
 */
export declare const FilterGroup: {
    readonly GEO: "filters.groups.geo";
    readonly DEVICE: "filters.groups.device";
    readonly TRAFFIC: "filters.groups.traffic";
    readonly SCHEDULE: "filters.groups.schedule";
    readonly LIMITS: "filters.groups.limits";
};
export type FilterGroupValue = typeof FilterGroup[keyof typeof FilterGroup];
/**
 * Abstract filter interface
 */
export interface FilterInterface {
    /**
     * Get filter key/name
     */
    getKey(): string;
    /**
     * Get filter group for UI categorization
     */
    getGroup(): FilterGroupValue;
    /**
     * Get filter description/tooltip
     */
    getTooltip?(): string;
    /**
     * Check if the click passes this filter
     */
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
    /**
     * Set server request context
     */
    setServerRequest?(request: ServerRequest): void;
    /**
     * Set logger for debug output
     */
    setLogger?(logger: {
        add(message: string): void;
    }): void;
}
/**
 * Abstract base class for filters
 */
export declare abstract class AbstractFilter implements FilterInterface {
    protected _serverRequest: ServerRequest | null;
    protected _logger: {
        add(message: string): void;
    } | null;
    abstract getKey(): string;
    abstract getGroup(): FilterGroupValue;
    abstract isPass(filter: StreamFilter, rawClick: RawClick): boolean;
    getTooltip(): string;
    setServerRequest(request: ServerRequest): void;
    setLogger(logger: {
        add(message: string): void;
    }): void;
    /**
     * Log a debug message
     */
    protected log(message: string): void;
}
//# sourceMappingURL=filter-interface.d.ts.map