/**
 * Country Filter
 * 
 * Filters clicks based on country code.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Country.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Empty query values that match missing data
 */
const EMPTY_QUERIES = ['', 'null', 'undefined', 'empty'];

export class CountryFilter extends AbstractFilter {
  getKey(): string {
    return 'country';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const country = rawClick.getCountry()?.toUpperCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueUpper = value.toUpperCase();
      
      // Check for empty value match
      if (EMPTY_QUERIES.includes(value) && country === '') {
        found = true;
        break;
      }
      
      // Check for exact country match
      if (country === valueUpper) {
        found = true;
        break;
      }
    }

    // Return based on mode
    if (filter.getMode() === FilterMode.ACCEPT) {
      return found;
    } else {
      return !found;
    }
  }
}

/**
 * Region Filter
 * 
 * Filters clicks based on region/state.
 */
export class RegionFilter extends AbstractFilter {
  getKey(): string {
    return 'region';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const region = rawClick.getRegion()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueLower = value.toLowerCase();
      
      if (EMPTY_QUERIES.includes(value) && region === '') {
        found = true;
        break;
      }
      
      if (region === valueLower || region.includes(valueLower)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * City Filter
 * 
 * Filters clicks based on city.
 */
export class CityFilter extends AbstractFilter {
  getKey(): string {
    return 'city';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const city = rawClick.getCity()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    let found = false;

    for (const value of payload) {
      const valueLower = value.toLowerCase();
      
      if (EMPTY_QUERIES.includes(value) && city === '') {
        found = true;
        break;
      }
      
      if (city === valueLower || city.includes(valueLower)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}
