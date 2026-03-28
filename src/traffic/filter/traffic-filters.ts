/**
 * Keyword Filter
 * 
 * Filters clicks based on keyword/search term.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Keyword.php (implied)
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Empty query values
 */
const EMPTY_QUERIES = ['', 'null', 'undefined', 'empty'];

export class KeywordFilter extends AbstractFilter {
  getKey(): string {
    return 'keyword';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  getTooltip(): string {
    return 'Filter by keyword or search term';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const keyword = rawClick.getKeyword()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueLower = value.toLowerCase();
      
      // Check for empty match
      if (EMPTY_QUERIES.includes(value) && keyword === '') {
        found = true;
        break;
      }
      
      // Check for contains match
      if (keyword.includes(valueLower)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Source Filter
 * 
 * Filters clicks based on traffic source.
 */
export class SourceFilter extends AbstractFilter {
  getKey(): string {
    return 'source';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const source = rawClick.getSource()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueLower = value.toLowerCase();
      
      if (EMPTY_QUERIES.includes(value) && source === '') {
        found = true;
        break;
      }
      
      if (source === valueLower || source.includes(valueLower)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Referrer Filter
 * 
 * Filters clicks based on referrer.
 */
export class ReferrerFilter extends AbstractFilter {
  getKey(): string {
    return 'referrer';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.TRAFFIC;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const referrer = rawClick.getReferrer()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueLower = value.toLowerCase();
      
      if (EMPTY_QUERIES.includes(value) && referrer === '') {
        found = true;
        break;
      }
      
      if (referrer.includes(valueLower)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}
