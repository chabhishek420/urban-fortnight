/**
 * IP Filter
 *
 * Filters clicks based on IP address or range.
 *
 * @see keitaro_source/application/Component/StreamFilters/Filter/Ip.php
 */
import { AbstractFilter, FilterGroupValue } from './filter-interface.js';
import type { StreamFilter } from './stream-filter.js';
import type { RawClick } from '../model/raw-click.js';
export declare class IpFilter extends AbstractFilter {
    getKey(): string;
    getGroup(): FilterGroupValue;
    getTooltip(): string;
    isPass(filter: StreamFilter, rawClick: RawClick): boolean;
    /**
     * Check if IP matches a mask
     */
    private checkIp;
    /**
     * Check if IP is in CIDR range
     */
    private ipInCIDR;
    /**
     * Check if IP is in range
     */
    private ipInRange;
    /**
     * Check if IP matches wildcard pattern
     */
    private ipInWildcard;
    /**
     * Convert IP string to number
     */
    private ipToNumber;
}
//# sourceMappingURL=ip-filter.d.ts.map