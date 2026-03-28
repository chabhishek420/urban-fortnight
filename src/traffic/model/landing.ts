/**
 * Landing Model
 * 
 * Represents a landing page in the system.
 * 
 * @see keitaro_source/application/Traffic/Model/Landing.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

/**
 * Landing type constants
 */
export const LandingType = {
  EXTERNAL: 'external',
  LOCAL: 'local'
} as const;

export type LandingTypeValue = typeof LandingType[keyof typeof LandingType];

/**
 * Landing model class
 */
export class Landing extends AbstractModel {
  protected static _tableName = 'landings';
  protected static _cacheKey = 'LANDINGS';
  protected static _aclKey = 'landings';
  protected static _entityName = 'landing';

  // === Getters ===

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  getUrl(): string | undefined {
    return this.get<string>('url');
  }

  getGroupId(): number | undefined {
    return this.get<number>('group_id');
  }

  getLandingType(): LandingTypeValue {
    return (this.get<string>('landing_type') as LandingTypeValue) ?? LandingType.EXTERNAL;
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  getActionType(): string | undefined {
    return this.get<string>('action_type');
  }

  getActionPayload(): string | undefined {
    return this.get<string>('action_payload');
  }

  getActionOptions(): Record<string, unknown> | undefined {
    return this.get<Record<string, unknown>>('action_options');
  }

  getOfferCount(): number {
    return this.get<number>('offer_count') ?? 1;
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  // === Type checks ===

  isExternal(): boolean {
    return this.getLandingType() === LandingType.EXTERNAL;
  }

  isLocal(): boolean {
    return this.getLandingType() === LandingType.LOCAL;
  }

  isDisabled(): boolean {
    return this.getState() === EntityState.DISABLED;
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
