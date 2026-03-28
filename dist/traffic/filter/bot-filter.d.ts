/**
 * Bot Filter
 *
 * Filters clicks based on bot detection.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/IsBot.php
 */
import { AbstractFilter, FilterGroupValue } from './filter-interface.js';
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
/**
 * Is Bot Filter
 */
export declare class IsBotFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    getTooltip(): string;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Proxy Filter
 *
 * Filters clicks based on proxy detection.
 */
export declare class ProxyFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    getTooltip(): string;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * User Agent Filter
 *
 * Filters clicks based on user agent string.
 */
export declare class UserAgentFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
/**
 * Operator Filter
 *
 * Filters clicks based on mobile carrier/operator.
 */
export declare class OperatorFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
}
//# sourceMappingURL=bot-filter.d.ts.map