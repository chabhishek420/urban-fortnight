/**
 * Traffic Source Model
 * 
 * @see keitaro_source/application/Traffic/Model/TrafficSource.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

export class TrafficSource extends AbstractModel {
  protected static _tableName = 'traffic_sources';
  protected static _cacheKey = 'TRAFFIC_SOURCES';
  protected static _aclKey = 'traffic_sources';
  protected static _entityName = 'traffic_source';

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  getPostbackUrl(): string | undefined {
    return this.get<string>('postback_url');
  }

  getPostbackStatuses(): string[] {
    const statuses = this.get<string>('postback_statuses');
    try {
      return statuses ? JSON.parse(statuses) : ['sale', 'lead', 'rejected', 'rebill'];
    } catch {
      return ['sale', 'lead', 'rejected', 'rebill'];
    }
  }

  getTemplateName(): string | undefined {
    return this.get<string>('template_name');
  }

  isAcceptParameters(): boolean {
    return this.get<number>('accept_parameters') === 1;
  }

  getParameters(): Record<string, unknown> | undefined {
    const params = this.get<string>('parameters');
    try {
      return params ? JSON.parse(params) : undefined;
    } catch {
      return undefined;
    }
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  getTrafficLoss(): number {
    return this.get<number>('traffic_loss') ?? 0;
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
