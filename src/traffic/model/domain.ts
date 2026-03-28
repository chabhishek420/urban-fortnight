/**
 * Domain Model
 * 
 * @see keitaro_source/application/Traffic/Model/Domain.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

export type DomainState = 'active' | 'disabled' | 'error';
export type SslStatus = 'valid' | 'invalid' | 'pending' | 'error';
export type NetworkStatus = 'ok' | 'error' | 'pending';

export class Domain extends AbstractModel {
  protected static _tableName = 'domains';
  protected static _cacheKey = 'DOMAINS';
  protected static _aclKey = 'domains';
  protected static _entityName = 'domain';

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  isSsl(): boolean {
    return this.get<number>('is_ssl') === 1;
  }

  getNetworkStatus(): NetworkStatus | undefined {
    return this.get<NetworkStatus>('network_status');
  }

  getDefaultCampaignId(): number | undefined {
    return this.get<number>('default_campaign_id');
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  isWildcard(): boolean {
    return this.get<number>('wildcard') === 1;
  }

  catchNotFound(): boolean {
    return this.get<number>('catch_not_found') === 1;
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  getErrorDescription(): string | undefined {
    return this.get<string>('error_description');
  }

  getSslStatus(): SslStatus | undefined {
    return this.get<SslStatus>('ssl_status');
  }

  getRedirect(): string {
    return this.get<string>('redirect') ?? 'not';
  }

  getSslData(): Record<string, unknown> | undefined {
    const data = this.get<string>('ssl_data');
    try {
      return data ? JSON.parse(data) : undefined;
    } catch {
      return undefined;
    }
  }

  isRobotsAllowed(): boolean {
    return this.get<number>('is_robots_allowed') === 1;
  }

  isSslRedirect(): boolean {
    return this.get<number>('ssl_redirect') === 1;
  }

  isAllowIndexing(): boolean {
    return this.get<number>('allow_indexing') === 1;
  }

  getCheckRetries(): number {
    return this.get<number>('check_retries') ?? 0;
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
