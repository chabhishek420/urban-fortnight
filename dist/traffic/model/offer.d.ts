/**
 * Offer Model
 *
 * Represents an offer (affiliate offer) in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Offer.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Offer type constants
 */
export declare const OfferType: {
    readonly EXTERNAL: "external";
    readonly LOCAL: "local";
};
export type OfferTypeValue = typeof OfferType[keyof typeof OfferType];
/**
 * Payout type constants
 */
export declare const PayoutType: {
    readonly CPA: "CPA";
    readonly CPL: "CPL";
    readonly CPS: "CPS";
    readonly REV_SHARE: "RevShare";
};
export type PayoutTypeValue = typeof PayoutType[keyof typeof PayoutType];
/**
 * Offer model class
 */
export declare class Offer extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    getUrl(): string | undefined;
    getGroupId(): number | undefined;
    getAffiliateNetworkId(): number | undefined;
    getOfferType(): OfferTypeValue;
    getState(): EntityState;
    getActionType(): string | undefined;
    getActionPayload(): string | undefined;
    getActionOptions(): Record<string, unknown> | undefined;
    getPayoutValue(): number;
    getPayoutCurrency(): string | undefined;
    getPayoutType(): PayoutTypeValue | undefined;
    isPayoutAuto(): boolean;
    isPayoutUpsell(): boolean;
    getCountry(): string | undefined;
    isConversionCapEnabled(): boolean;
    getDailyCap(): number;
    getConversionTimezone(): string;
    getAlternativeOfferId(): number | undefined;
    getNotes(): string | undefined;
    isExternal(): boolean;
    isLocal(): boolean;
    isDisabled(): boolean;
    isActive(): boolean;
}
//# sourceMappingURL=offer.d.ts.map