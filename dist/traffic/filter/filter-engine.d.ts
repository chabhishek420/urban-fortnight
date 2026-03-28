/**
 * Filter Engine
 *
 * Orchestrates filter evaluation for streams.
 *
 * @see keitaro_source/application/Component/StreamFilters/CheckFilters.php
 */
import type { StreamFilter } from './stream-filter.js';
import type { AbstractFilter } from './filter-interface.js';
import type { RawClick } from '../model/raw-click.js';
import type { BaseStream } from '../model/base-stream.js';
import type { ServerRequest } from '../request/server-request.js';
/**
 * Filter engine options
 */
export interface FilterEngineOptions {
    serverRequest: ServerRequest;
    stream: BaseStream;
    rawClick: RawClick;
    logger?: {
        add(message: string): void;
    };
}
/**
 * Filter Engine class
 */
export declare class FilterEngine {
    private _serverRequest;
    private _stream;
    private _rawClick;
    private _logger;
    private _filterRegistry;
    constructor(options: FilterEngineOptions);
    /**
     * Register a filter implementation
     */
    registerFilter(name: string, filter: AbstractFilter): void;
    /**
     * Get a registered filter
     */
    getFilter(name: string): AbstractFilter | undefined;
    /**
     * Check if all filters pass
     */
    isPass(filters: StreamFilter[]): boolean;
    /**
     * Evaluate a single filter
     */
    evaluateFilter(filterData: StreamFilter): boolean;
}
/**
 * Check filters against a click
 *
 * Convenience function for filter checking
 */
export declare function checkFilters(serverRequest: ServerRequest, stream: BaseStream, rawClick: RawClick, filters: StreamFilter[], filterImplementations: Map<string, AbstractFilter>, logger?: {
    add(message: string): void;
}): boolean;
//# sourceMappingURL=filter-engine.d.ts.map