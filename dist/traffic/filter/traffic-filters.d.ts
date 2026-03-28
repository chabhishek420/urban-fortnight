/**
 * Keyword Filter
 *
 * Filters clicks based on keyword/search term.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Keyword.php (implied)
 */
import { AbstractFilter, FilterGroupValue } from './filter-interface.js';
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
export declare class KeywordFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    getTooltip(): string;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Source Filter
 *
 * Filters clicks based on traffic source.
 */
export declare class SourceFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Referrer Filter
 *
 * Filters clicks based on referrer.
 */
export declare class ReferrerFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
//# sourceMappingURL=traffic-filters.d.ts.map