/**
 * Stream Filter Model
 *
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
/**
 * Filter mode constants
 */
export declare const FilterMode: {
    readonly ACCEPT: "accept";
    readonly REJECT: "reject";
};
export type FilterModeValue = typeof FilterMode[keyof typeof FilterMode];
/**
 * Filter name constants
 */
export declare const FilterName: {
    readonly COUNTRY: "country";
    readonly REGION: "region";
    readonly CITY: "city";
    readonly IP: "ip";
    readonly KEYWORD: "keyword";
    readonly USER_AGENT: "user_agent";
    readonly DEVICE: "device_type";
    readonly OS: "os";
    readonly BROWSER: "browser";
    readonly LANGUAGE: "language";
    readonly REFERER: "referer";
    readonly SCHEDULE: "schedule";
    readonly LIMIT: "limit";
    readonly ISP: "isp";
    readonly CONNECTION_TYPE: "connection_type";
};
export type FilterNameValue = typeof FilterName[keyof typeof FilterName];
export declare class StreamFilter extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _entityName: string;
    getStreamId(): number;
    getName(): FilterNameValue;
    getMode(): FilterModeValue;
    getPayload(): unknown;
    isAcceptMode(): boolean;
    isRejectMode(): boolean;
    /**
     * Check if this filter matches the given context
     */
    matches(context: Record<string, unknown>): boolean;
}
//# sourceMappingURL=stream-filter.d.ts.map