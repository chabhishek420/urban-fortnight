/**
 * Campaign Model
 *
 * Represents a tracking campaign in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Campaign.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Campaign type constants
 */
export declare const CampaignType: {
    readonly POSITION: "position";
    readonly WEIGHT: "weight";
};
export type CampaignTypeValue = typeof CampaignType[keyof typeof CampaignType];
/**
 * Cost type constants
 */
export declare const CostType: {
    readonly CPM: "CPM";
    readonly CPC: "CPC";
    readonly CPUC: "CPUC";
    readonly CPA: "CPA";
    readonly CPS: "CPS";
    readonly REV_SHARE: "RevShare";
    readonly CPV: "CPV";
};
export type CostTypeValue = typeof CostType[keyof typeof CostType];
/**
 * Uniqueness method constants
 */
export declare const UniquenessMethod: {
    readonly COOKIE_AND_IP: "cookie_and_ip";
    readonly IP: "ip";
    readonly COOKIE: "cookie";
};
export type UniquenessMethodValue = typeof UniquenessMethod[keyof typeof UniquenessMethod];
/**
 * Unique check method constants
 */
export declare const UniqueCheckMethod: {
    readonly IP_UA: "ip_ua";
    readonly IP: "ip";
};
/**
 * Visitor binding options
 */
export declare const VisitorBinding: {
    readonly STREAM_LANDING_OFFER: "slo";
    readonly STREAM_LANDING: "sl";
    readonly STREAM: "s";
};
/**
 * Campaign model class
 */
export declare class Campaign extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    static readonly DEFAULT_COOKIES_TTL = 24;
    static readonly MIN_COOKIES_TTL = 1;
    static readonly MAX_COOKIES_TTL = 8760;
    getName(): string;
    getAlias(): string | undefined;
    getToken(): string | undefined;
    getType(): CampaignTypeValue;
    getMode(): string;
    getState(): EntityState;
    getPosition(): number;
    getGroupId(): number | undefined;
    getCookiesTtl(): number;
    getUniquenessMethod(): UniquenessMethodValue;
    getActionType(): string | undefined;
    getActionPayload(): string | undefined;
    getCostType(): CostTypeValue;
    getCostValue(): number;
    getCostCurrency(): string | undefined;
    getTrafficSourceId(): number | undefined;
    getDomainId(): number | undefined;
    getParameters(): Record<string, unknown> | undefined;
    getTrafficLoss(): number;
    getNotes(): string | undefined;
    isTypePosition(): boolean;
    isWeightPosition(): boolean;
    isDisabled(): boolean;
    isUniqueByIpUa(): boolean;
    isUniqueByIp(): boolean;
    isUniquenessUseCookies(): boolean;
    isCostAuto(): boolean;
    isCostPerUnique(): boolean;
    isCostPerThousand(): boolean;
    isCostPerClick(): boolean;
    isCostPerAcquisition(): boolean;
    isCostPerSale(): boolean;
    isCostRevShare(): boolean;
    isBindVisitorsEnabled(): boolean;
    isBindVisitorsLandingEnabled(): boolean;
    isBindVisitorsOfferEnabled(): boolean;
    setPosition(value: number): this;
    setActionPayload(value: string): this;
}
//# sourceMappingURL=campaign.d.ts.map