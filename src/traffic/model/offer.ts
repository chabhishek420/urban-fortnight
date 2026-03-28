/**
 * Offer Model
 * 
 * Represents an offer (affiliate offer) in the system.
 * 
 * @see keitaro_source/application/Traffic/Model/Offer.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

/**
 * Offer type constants
 */
export const OfferType = {
  EXTERNAL: 'external',
  LOCAL: 'local'
} as const;

export type OfferTypeValue = typeof OfferType[keyof typeof OfferType];

/**
 * Payout type constants
 */
export const PayoutType = {
  CPA: 'CPA',
  CPL: 'CPL',
  CPS: 'CPS',
  REV_SHARE: 'RevShare'
} as const;

export type PayoutTypeValue = typeof PayoutType[keyof typeof PayoutType];

/**
 * Offer model class
 */
export class Offer extends AbstractModel {
  protected static _tableName = 'offers';
  protected static _cacheKey = 'OFFERS';
  protected static _aclKey = 'offers';
  protected static _entityName = 'offer';

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

  getAffiliateNetworkId(): number | undefined {
    return this.get<number>('affiliate_network_id');
  }

  getOfferType(): OfferTypeValue {
    return (this.get<string>('offer_type') as OfferTypeValue) ?? OfferType.EXTERNAL;
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

  // Payouts
  getPayoutValue(): number {
    return this.get<number>('payout_value') ?? 0;
  }

  getPayoutCurrency(): string | undefined {
    return this.get<string>('payout_currency');
  }

  getPayoutType(): PayoutTypeValue | undefined {
    return this.get<string>('payout_type') as PayoutTypeValue | undefined;
  }

  isPayoutAuto(): boolean {
    return this.get<number>('payout_auto') === 1;
  }

  isPayoutUpsell(): boolean {
    return this.get<number>('payout_upsell') === 1;
  }

  // Country
  getCountry(): string | undefined {
    return this.get<string>('country');
  }

  // Conversion cap
  isConversionCapEnabled(): boolean {
    return this.get<number>('conversion_cap_enabled') === 1;
  }

  getDailyCap(): number {
    return this.get<number>('daily_cap') ?? 0;
  }

  getConversionTimezone(): string {
    return this.get<string>('conversion_timezone') ?? 'UTC';
  }

  getAlternativeOfferId(): number | undefined {
    return this.get<number>('alternative_offer_id');
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  // === Type checks ===

  isExternal(): boolean {
    return this.getOfferType() === OfferType.EXTERNAL;
  }

  isLocal(): boolean {
    return this.getOfferType() === OfferType.LOCAL;
  }

  isDisabled(): boolean {
    return this.getState() === EntityState.DISABLED;
  }

  isActive(): boolean {
    return this.getState() === EntityState.ACTIVE;
  }
}
