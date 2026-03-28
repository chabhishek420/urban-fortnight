/**
 * Stream Filter Model
 *
 * Represents a filter applied to a stream.
 *
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */
/**
 * Filter mode constants
 */
export declare const FilterMode: {
    readonly ACCEPT: "accept";
    readonly REJECT: "reject";
};
export type FilterModeValue = typeof FilterMode[keyof typeof FilterMode];
/**
 * Stream filter interface
 */
export interface StreamFilterData {
    id: number;
    streamId: number;
    name: string;
    mode: FilterModeValue;
    payload: unknown;
}
/**
 * Stream Filter class
 */
export declare class StreamFilter {
    private _data;
    constructor(data?: Partial<StreamFilterData>);
    getId(): number;
    getStreamId(): number;
    getName(): string;
    getMode(): FilterModeValue;
    getPayload<T = unknown>(): T;
    setData(data: Partial<StreamFilterData>): void;
}
//# sourceMappingURL=stream-filter.d.ts.map