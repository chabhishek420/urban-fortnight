/**
 * Base Stream Model
 * 
 * Represents a traffic stream within a campaign.
 * 
 * @see keitaro_source/application/Traffic/Model/BaseStream.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

/**
 * Stream type constants
 */
export const StreamType = {
  REGULAR: 'regular',
  DEFAULT: 'default',
  LANDINGS_OFFERS: 'landings_offers',
  OFFERS: 'offers',
  LANDINGS: 'landings'
} as const;

export type StreamTypeValue = typeof StreamType[keyof typeof StreamType];

/**
 * Stream schema constants
 */
export const StreamSchema = {
  LANDING_OFFER: 'landing_offer',
  OFFER: 'offer',
  LANDINGS: 'landings'
} as const;

export type StreamSchemaValue = typeof StreamSchema[keyof typeof StreamSchema];

/**
 * Base Stream model class
 */
export class BaseStream extends AbstractModel {
  protected static _tableName = 'streams';
  protected static _cacheKey = 'STREAMS';
  protected static _aclKey = 'streams';
  protected static _entityName = 'stream';

  // === Getters ===

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  getCampaignId(): number | undefined {
    // Try camelCase first (Prisma), then snake_case (legacy)
    return this.get<number>('campaignId') ?? this.get<number>('campaign_id');
  }

  getGroupId(): number | undefined {
    return this.get<number>('groupId') ?? this.get<number>('group_id');
  }

  getType(): StreamTypeValue {
    return (this.get<string>('type') as StreamTypeValue) ?? StreamType.REGULAR;
  }

  getSchema(): StreamSchemaValue | null {
    const schema = this.get<string>('schema');
    return schema ? schema as StreamSchemaValue : null;
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  getPosition(): number {
    return this.get<number>('position') ?? 1;
  }

  getWeight(): number {
    return this.get<number>('weight') ?? 0;
  }

  getChance(): number {
    return this.get<number>('chance') ?? 0;
  }

  getActionType(): string | undefined {
    // Try camelCase first (Prisma), then snake_case (legacy)
    return this.get<string>('actionType') ?? this.get<string>('action_type');
  }

  getActionPayload(): string | undefined {
    return this.get<string>('actionPayload') ?? this.get<string>('action_payload');
  }

  getActionOptions(): Record<string, unknown> | undefined {
    return this.get<Record<string, unknown>>('actionOptions') ?? this.get<Record<string, unknown>>('action_options');
  }

  getComments(): string | undefined {
    return this.get<string>('comments');
  }

  isCollectClicks(): boolean {
    const val = this.get<boolean>('collectClicks') ?? this.get<number>('collect_clicks');
    return val === true || val === 1;
  }

  isFilterOr(): boolean {
    const val = this.get<boolean>('filterOr') ?? this.get<number>('filter_or');
    return val === true || val === 1;
  }

  // === Type checks ===

  isDisabled(): boolean {
    return this.getState() === EntityState.DISABLED;
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
