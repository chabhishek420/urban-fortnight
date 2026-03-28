/**
 * Parameter Filter
 * 
 * Filters clicks based on URL/query parameters.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Parameter.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Parameter payload interface
 */
interface ParameterPayload {
  name: string;
  value: string | string[];
}

/**
 * Parameter Filter
 * 
 * Filters clicks based on URL query or POST parameters.
 */
export class ParameterFilter extends AbstractFilter {
  getKey(): string {
    return 'parameter';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  getTooltip(): string {
    return 'Filter by URL or POST parameter value';
  }

  isPass(filter: StreamFilter, _rawClick: RawClick): boolean {
    const payload = filter.getPayload() as ParameterPayload;
    
    if (!payload || !payload.name) {
      return true;
    }

    const value = this.getParam(payload.name);
    
    if (value === null || value === undefined) {
      // Parameter not found
      return filter.getMode() === FilterMode.REJECT;
    }

    let found = false;
    const searchValues = Array.isArray(payload.value) ? payload.value : [payload.value];

    for (const searchValue of searchValues) {
      if (this.findInWithRegexSupport(value, searchValue)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }

  /**
   * Get parameter value from request
   */
  private getParam(name: string): string | null {
    if (!this._serverRequest) {
      return null;
    }

    // Check query parameters
    const queryParams = this._serverRequest.getQueryParams?.() || {};
    if (queryParams[name] !== undefined) {
      return queryParams[name];
    }

    // Check POST/body parameters
    const bodyParams = this._serverRequest.getBody?.() as Record<string, string> | null;
    if (bodyParams && bodyParams[name] !== undefined) {
      return bodyParams[name];
    }

    return null;
  }

  /**
   * Find value with regex support
   */
  private findInWithRegexSupport(value: string, search: string): boolean {
    if (!search || !value) {
      return false;
    }

    // Check if it's a regex pattern (starts with /)
    if (search.startsWith('/') && search.endsWith('/')) {
      try {
        const pattern = search.slice(1, -1);
        const regex = new RegExp(pattern, 'i');
        return regex.test(value);
      } catch {
        // Invalid regex, try exact match
        return value === search;
      }
    }

    // Wildcard support
    if (search.includes('*')) {
      const pattern = search.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`, 'i');
      return regex.test(value);
    }

    // Case-insensitive contains match
    return value.toLowerCase().includes(search.toLowerCase());
  }
}

/**
 * Any Param Filter
 * 
 * Filters based on any query parameter presence.
 */
export class AnyParamFilter extends AbstractFilter {
  getKey(): string {
    return 'any_param';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  getTooltip(): string {
    return 'Filter if any query parameter exists';
  }

  isPass(filter: StreamFilter, _rawClick: RawClick): boolean {
    if (!this._serverRequest) {
      return true;
    }

    const queryParams = this._serverRequest.getQueryParams?.() || {};
    const hasParams = Object.keys(queryParams).length > 0;

    return filter.getMode() === FilterMode.ACCEPT ? hasParams : !hasParams;
  }
}

/**
 * Empty Referrer Filter
 * 
 * Filters clicks based on whether referrer is empty.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/EmptyReferrer.php
 */
export class EmptyReferrerFilter extends AbstractFilter {
  getKey(): string {
    return 'empty_referrer';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  getTooltip(): string {
    return 'Filter by empty referrer (direct traffic)';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const referrer = rawClick.getReferrer?.();
    const isEmpty = !referrer || referrer === '';

    return filter.getMode() === FilterMode.ACCEPT ? isEmpty : !isEmpty;
  }
}
