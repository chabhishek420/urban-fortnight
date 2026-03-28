/**
 * Device Filters
 *
 * Filters clicks based on device characteristics.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/
 */
import { AbstractFilter, FilterGroupValue } from './filter-interface.js';
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
/**
 * Device Type Filter
 */
export declare class DeviceTypeFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * OS Filter
 */
export declare class OsFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Browser Filter
 */
export declare class BrowserFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Browser Version Filter
 */
export declare class BrowserVersionFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Language Filter
 */
export declare class LanguageFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Connection Type Filter
 */
export declare class ConnectionTypeFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * ISP Filter
 */
export declare class IspFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
//# sourceMappingURL=device-filters.d.ts.map