/**
 * Filter Interface
 * 
 * Base interface for all stream filters.
 * 
 * @see keitaro_source/application/Core/Filter/AbstractFilter.php
 */
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import type { ServerRequest } from '../request/server-request';

/**
 * Filter group constants
 */
export const FilterGroup = {
  GEO: 'filters.groups.geo',
  DEVICE: 'filters.groups.device',
  TRAFFIC: 'filters.groups.traffic',
  SCHEDULE: 'filters.groups.schedule',
  LIMITS: 'filters.groups.limits'
} as const;

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
  setLogger?(logger: { add(message: string): void }): void;
}

/**
 * Abstract base class for filters
 */
export abstract class AbstractFilter implements FilterInterface {
  protected _serverRequest: ServerRequest | null = null;
  protected _logger: { add(message: string): void } | null = null;

  abstract getKey(): string;
  abstract getGroup(): FilterGroupValue;
  abstract isPass(filter: StreamFilter, rawClick: RawClick): boolean;

  getTooltip(): string {
    return '';
  }

  setServerRequest(request: ServerRequest): void {
    this._serverRequest = request;
  }

  setLogger(logger: { add(message: string): void }): void {
    this._logger = logger;
  }

  /**
   * Log a debug message
   */
  protected log(message: string): void {
    if (this._logger) {
      this._logger.add(message);
    }
  }
}
