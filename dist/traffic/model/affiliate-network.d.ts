/**
 * Affiliate Network Model
 *
 * @see keitaro_source/application/Traffic/Model/AffiliateNetwork.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
export declare class AffiliateNetwork extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    getPostbackUrl(): string | undefined;
    getOfferParam(): string | undefined;
    getState(): EntityState;
    getTemplateName(): string | undefined;
    getNotes(): string | undefined;
    getPullApiOptions(): Record<string, unknown> | undefined;
    isActive(): boolean;
}
//# sourceMappingURL=affiliate-network.d.ts.map