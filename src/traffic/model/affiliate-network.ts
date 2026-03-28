/**
 * Affiliate Network Model
 * 
 * @see keitaro_source/application/Traffic/Model/AffiliateNetwork.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

export class AffiliateNetwork extends AbstractModel {
  protected static _tableName = 'affiliate_networks';
  protected static _cacheKey = 'AFFILIATE_NETWORKS';
  protected static _aclKey = 'affiliate_networks';
  protected static _entityName = 'affiliate_network';

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  getPostbackUrl(): string | undefined {
    return this.get<string>('postback_url');
  }

  getOfferParam(): string | undefined {
    return this.get<string>('offer_param');
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  getTemplateName(): string | undefined {
    return this.get<string>('template_name');
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  getPullApiOptions(): Record<string, unknown> | undefined {
    return this.get<Record<string, unknown>>('pull_api_options');
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
