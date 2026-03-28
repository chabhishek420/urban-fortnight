/**
 * Traffic Source Model
 *
 * @see keitaro_source/application/Traffic/Model/TrafficSource.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
export declare class TrafficSource extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    getPostbackUrl(): string | undefined;
    getPostbackStatuses(): string[];
    getTemplateName(): string | undefined;
    isAcceptParameters(): boolean;
    getParameters(): Record<string, unknown> | undefined;
    getState(): EntityState;
    getNotes(): string | undefined;
    getTrafficLoss(): number;
    isActive(): boolean;
}
//# sourceMappingURL=traffic-source.d.ts.map