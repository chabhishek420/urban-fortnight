/**
 * Domain Model
 *
 * @see keitaro_source/application/Traffic/Model/Domain.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
import { EntityState } from '../../core/entity/state.js';
export type DomainState = 'active' | 'disabled' | 'error';
export type SslStatus = 'valid' | 'invalid' | 'pending' | 'error';
export type NetworkStatus = 'ok' | 'error' | 'pending';
export declare class Domain extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getName(): string;
    isSsl(): boolean;
    getNetworkStatus(): NetworkStatus | undefined;
    getDefaultCampaignId(): number | undefined;
    getState(): EntityState;
    isWildcard(): boolean;
    catchNotFound(): boolean;
    getNotes(): string | undefined;
    getErrorDescription(): string | undefined;
    getSslStatus(): SslStatus | undefined;
    getRedirect(): string;
    getSslData(): Record<string, unknown> | undefined;
    isRobotsAllowed(): boolean;
    isSslRedirect(): boolean;
    isAllowIndexing(): boolean;
    getCheckRetries(): number;
    isActive(): boolean;
}
//# sourceMappingURL=domain.d.ts.map