/**
 * Country Filter
 *
 * Filters clicks based on country code.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Country.php
 */
import { AbstractFilter, FilterGroupValue } from './filter-interface.js';
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
export declare class CountryFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Region Filter
 *
 * Filters clicks based on region/state.
 */
export declare class RegionFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * City Filter
 *
 * Filters clicks based on city.
 */
export declare class CityFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
//# sourceMappingURL=geo-filters.d.ts.map