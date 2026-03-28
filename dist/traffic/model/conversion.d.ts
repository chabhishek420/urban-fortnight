/**
 * Conversion Model
 *
 * @see keitaro_source/application/Traffic/Model/Conversion.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
export type ConversionStatus = 'lead' | 'sale' | 'rejected' | 'rebill';
export declare class Conversion extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getSubId(): string;
    getTid(): string | undefined;
    getStatus(): ConversionStatus | undefined;
    getPreviousStatus(): ConversionStatus | undefined;
    getOriginalStatus(): ConversionStatus | undefined;
    getRevenue(): number;
    getCost(): number;
    getCampaignId(): number | undefined;
    getStreamId(): number | undefined;
    getOfferId(): number | undefined;
    getLandingId(): number | undefined;
    getClickId(): number | undefined;
    getVisitorId(): bigint | undefined;
    getClickDatetime(): Date | undefined;
    getPostbackDatetime(): Date | undefined;
    getSaleDatetime(): Date | undefined;
    isProcessed(): boolean;
    getParams(): Record<string, unknown> | undefined;
    isLead(): boolean;
    isSale(): boolean;
    isRejected(): boolean;
    isRebill(): boolean;
    getProfit(): number;
}
//# sourceMappingURL=conversion.d.ts.map