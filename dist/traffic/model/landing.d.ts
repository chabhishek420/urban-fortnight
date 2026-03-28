/**
 * Landing Model
 *
 * Represents a landing page in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Landing.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
/**
 * Landing type constants
 */
export declare const LandingType: {
    readonly EXTERNAL: "external";
    readonly LOCAL: "local";
};
export type LandingTypeValue = typeof LandingType[keyof typeof LandingType];
/**
 * Landing model class
 */
export declare class Landing extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    getUrl(): string | undefined;
    getGroupId(): number | undefined;
    getLandingType(): LandingTypeValue;
    getState(): EntityState;
    getActionType(): string | undefined;
    getActionPayload(): string | undefined;
    getActionOptions(): Record<string, unknown> | undefined;
    getOfferCount(): number;
    getNotes(): string | undefined;
    isExternal(): boolean;
    isLocal(): boolean;
    isDisabled(): boolean;
    isActive(): boolean;
}
//# sourceMappingURL=landing.d.ts.map