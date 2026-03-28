/**
 * Check Filters
 * 
 * Evaluates all filters for a stream to determine if it passes.
 * This is the core cloaking logic that determines traffic routing.
 * 
 * @see keitaro_source/application/Component/StreamFilters/CheckFilters.php
 */

import type { ServerRequest } from '../request/server-request';
import type { BaseStream } from '../model/base-stream';
import type { RawClick } from '../model/raw-click';
import type { TrafficLogEntry } from '../logging/traffic-log-entry';
import { CachedStreamFilterRepository } from '../repository/cached-stream-filter-repository';
import { createAllFilters, type AbstractFilter } from '../filter/index';

/**
 * Check Filters
 * 
 * Evaluates whether a stream's filters pass for a given click.
 * Used during stream selection to determine valid streams.
 */
export class CheckFilters {
  private _serverRequest: ServerRequest;
  private _stream: BaseStream;
  private _rawClick: RawClick;
  private _logEntry: TrafficLogEntry;
  private _filterRegistry: Map<string, AbstractFilter>;
  private _streamFilterRepository: CachedStreamFilterRepository;

  constructor(
    serverRequest: ServerRequest,
    stream: BaseStream,
    rawClick: RawClick,
    logEntry: TrafficLogEntry
  ) {
    this._serverRequest = serverRequest;
    this._stream = stream;
    this._rawClick = rawClick;
    this._logEntry = logEntry;
    this._filterRegistry = createAllFilters();
    this._streamFilterRepository = CachedStreamFilterRepository.getInstance();
  }

  /**
   * Check if all filters pass for the stream
   * 
   * This is the main method called during stream selection.
   * Returns true if the stream's filters allow this click through.
   */
  async isPass(): Promise<boolean> {
    this._logEntry.add(`Checking stream #${this._stream.getId() ?? 'unknown'}`);

    // Load filters for this stream
    const filters = await this._streamFilterRepository.allCached(this._stream);

    if (filters.length === 0) {
      this._logEntry.add(`Stream #${this._stream.getId() ?? 'unknown'} contains no filters. Passed.`);
      return true;
    }

    const blockedOrFilters: string[] = [];
    const isFilterOr = this._stream.isFilterOr();

    for (const filterData of filters) {
      const filter = this._filterRegistry.get(filterData.getName());

      if (!filter) {
        this._logEntry.add(`Unknown filter "${filterData.getName()}"`);
        continue;
      }

      filter.setServerRequest(this._serverRequest);
      filter.setLogger(this._logEntry);

      if (!filter.isPass(filterData, this._rawClick)) {
        if (!isFilterOr) {
          // AND mode: one failure means the stream is blocked
          this._logEntry.add(`Blocks by filter "${filterData.getName()}". Not passed.`);
          return false;
        }
        // OR mode: track blocked filters, continue checking
        blockedOrFilters.push(filter.getKey());
      } else {
        if (isFilterOr) {
          // OR mode: one pass means the stream is accepted
          const payload = filterData.getPayload() as Record<string, unknown> | null;
          const msg = payload?.name
            ? `Accepts by filter "${filterData.getName()}" by parameter name: "${payload.name}". Passed.`
            : `Accepts by filter "${filterData.getName()}". Passed.`;
          this._logEntry.add(msg);
          return true;
        }
      }
    }

    if (isFilterOr) {
      // OR mode: all filters blocked
      this._logEntry.add(`Deny by all the filters: ${blockedOrFilters.join(', ')}. Not passed.`);
      return false;
    }

    // AND mode: all filters passed
    this._logEntry.add('All filters are checked. Passed.');
    return true;
  }

  /**
   * Get filter registry (for testing/debugging)
   */
  getFilterRegistry(): Map<string, AbstractFilter> {
    return this._filterRegistry;
  }
}

/**
 * Check if stream filters pass (convenience function)
 */
export async function checkStreamFilters(
  serverRequest: ServerRequest,
  stream: BaseStream,
  rawClick: RawClick,
  logEntry: TrafficLogEntry
): Promise<boolean> {
  const checker = new CheckFilters(serverRequest, stream, rawClick, logEntry);
  return checker.isPass();
}
