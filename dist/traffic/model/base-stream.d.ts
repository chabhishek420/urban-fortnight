/**
 * Base Stream Model
 *
 * Represents a traffic stream within a campaign.
 *
 * @see keitaro_source/application/Traffic/Model/BaseStream.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Stream type constants
 */
export declare const StreamType: {
    readonly REGULAR: "regular";
    readonly DEFAULT: "default";
    readonly LANDINGS_OFFERS: "landings_offers";
    readonly OFFERS: "offers";
    readonly LANDINGS: "landings";
};
export type StreamTypeValue = typeof StreamType[keyof typeof StreamType];
/**
 * Stream schema constants
 */
export declare const StreamSchema: {
    readonly LANDING_OFFER: "landing_offer";
    readonly OFFER: "offer";
    readonly LANDINGS: "landings";
};
export type StreamSchemaValue = typeof StreamSchema[keyof typeof StreamSchema];
/**
 * Base Stream model class
 */
export declare class BaseStream extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    getCampaignId(): number | undefined;
    getGroupId(): number | undefined;
    getType(): StreamTypeValue;
    getSchema(): StreamSchemaValue | null;
    getState(): EntityState;
    getPosition(): number;
    getWeight(): number;
    getChance(): number;
    getActionType(): string | undefined;
    getActionPayload(): string | undefined;
    getActionOptions(): Record<string, unknown> | undefined;
    getComments(): string | undefined;
    isCollectClicks(): boolean;
    isFilterOr(): boolean;
    isDisabled(): boolean;
    isActive(): boolean;
}
//# sourceMappingURL=base-stream.d.ts.map