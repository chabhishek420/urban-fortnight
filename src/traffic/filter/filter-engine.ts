/**
 * Filter Engine
 * 
 * Orchestrates filter evaluation for streams.
 * 
 * @see keitaro_source/application/Component/StreamFilters/CheckFilters.php
 */
import type { StreamFilter } from '../model/stream-filter';
import type { AbstractFilter } from './filter-interface';
import type { RawClick } from '../model/raw-click';
import type { BaseStream } from '../model/base-stream';
import type { ServerRequest } from '../request/server-request';

/**
 * Filter engine options
 */
export interface FilterEngineOptions {
  serverRequest: ServerRequest;
  stream: BaseStream;
  rawClick: RawClick;
  logger?: { add(message: string): void };
}

/**
 * Filter Engine class
 */
export class FilterEngine {
  private _serverRequest: ServerRequest;
  private _stream: BaseStream;
  private _rawClick: RawClick;
  private _logger: { add(message: string): void };
  private _filterRegistry: Map<string, AbstractFilter> = new Map();

  constructor(options: FilterEngineOptions) {
    this._serverRequest = options.serverRequest;
    this._stream = options.stream;
    this._rawClick = options.rawClick;
    this._logger = options.logger ?? { add: () => {} };
  }

  /**
   * Register a filter implementation
   */
  public registerFilter(name: string, filter: AbstractFilter): void {
    this._filterRegistry.set(name, filter);
  }

  /**
   * Get a registered filter
   */
  public getFilter(name: string): AbstractFilter | undefined {
    return this._filterRegistry.get(name);
  }

  /**
   * Check if all filters pass
   */
  public isPass(filters: StreamFilter[]): boolean {
    this._logger.add(`Checking stream #${this._stream.getId() ?? 'unknown'}`);

    if (filters.length === 0) {
      this._logger.add('Stream contains no filters. Passed.');
      return true;
    }

    const blockedOrFilters: string[] = [];
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
      } else {
        if (isFilterOr) {
          const payload = filterData.getPayload() as Record<string, unknown> | null;
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
  public evaluateFilter(filterData: StreamFilter): boolean {
    const filter = this._filterRegistry.get(filterData.getName());
    
    if (!filter) {
      return true;
    }

    filter.setServerRequest(this._serverRequest);
    return filter.isPass(filterData, this._rawClick);
  }
}

/**
 * Check filters against a click
 * 
 * Convenience function for filter checking
 */
export function checkFilters(
  serverRequest: ServerRequest,
  stream: BaseStream,
  rawClick: RawClick,
  filters: StreamFilter[],
  filterImplementations: Map<string, AbstractFilter>,
  logger?: { add(message: string): void }
): boolean {
  const engine = new FilterEngine({
    serverRequest,
    stream,
    rawClick,
    logger: logger ?? { add: () => {} }
  });

  // Register all filter implementations
  for (const [name, filter] of filterImplementations) {
    engine.registerFilter(name, filter);
  }

  return engine.isPass(filters);
}
