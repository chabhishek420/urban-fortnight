/**
 * Campaign Model
 * 
 * Represents a tracking campaign in the system.
 * 
 * @see keitaro_source/application/Traffic/Model/Campaign.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
import { EntityState } from '../../core/entity/state';

/**
 * Campaign type constants
 */
export const CampaignType = {
  POSITION: 'position',
  WEIGHT: 'weight'
} as const;

export type CampaignTypeValue = typeof CampaignType[keyof typeof CampaignType];

/**
 * Cost type constants
 */
export const CostType = {
  CPM: 'CPM',     // Cost per mille (thousand impressions)
  CPC: 'CPC',     // Cost per click
  CPUC: 'CPUC',   // Cost per unique click
  CPA: 'CPA',     // Cost per action
  CPS: 'CPS',     // Cost per sale
  REV_SHARE: 'RevShare', // Revenue share
  CPV: 'CPV'      // Cost per view
} as const;

export type CostTypeValue = typeof CostType[keyof typeof CostType];

/**
 * Uniqueness method constants
 */
export const UniquenessMethod = {
  COOKIE_AND_IP: 'cookie_and_ip',
  IP: 'ip',
  COOKIE: 'cookie'
} as const;

export type UniquenessMethodValue = typeof UniquenessMethod[keyof typeof UniquenessMethod];

/**
 * Unique check method constants
 */
export const UniqueCheckMethod = {
  IP_UA: 'ip_ua',
  IP: 'ip'
} as const;

/**
 * Visitor binding options
 */
export const VisitorBinding = {
  STREAM_LANDING_OFFER: 'slo',
  STREAM_LANDING: 'sl',
  STREAM: 's'
} as const;

/**
 * Campaign model class
 */
export class Campaign extends AbstractModel {
  protected static _tableName = 'campaigns';
  protected static _cacheKey = 'CAMPAIGNS';
  protected static _aclKey = 'campaigns';
  protected static _entityName = 'campaign';

  // Default values
  static readonly DEFAULT_COOKIES_TTL = 24;
  static readonly MIN_COOKIES_TTL = 1;
  static readonly MAX_COOKIES_TTL = 8760;

  // === Getters ===

  getName(): string {
    return this.get<string>('name') ?? '';
  }

  getAlias(): string | undefined {
    return this.get<string>('alias');
  }

  getToken(): string | undefined {
    return this.get<string>('token');
  }

  getType(): CampaignTypeValue {
    return (this.get<string>('type') as CampaignTypeValue) ?? CampaignType.POSITION;
  }

  getMode(): string {
    return this.get<string>('mode') ?? 'general';
  }

  getState(): EntityState {
    const state = this.get<string>('state');
    return state === 'active' ? EntityState.ACTIVE : EntityState.DISABLED;
  }

  getPosition(): number {
    return this.get<number>('position') ?? 0;
  }

  getGroupId(): number | undefined {
    return this.get<number>('group_id');
  }

  getCookiesTtl(): number {
    return this.get<number>('cookies_ttl') ?? Campaign.DEFAULT_COOKIES_TTL;
  }

  getUniquenessMethod(): UniquenessMethodValue {
    return (this.get<string>('uniqueness_method') as UniquenessMethodValue) ?? UniqueCheckMethod.IP_UA;
  }

  getActionType(): string | undefined {
    return this.get<string>('action_type');
  }

  getActionPayload(): string | undefined {
    return this.get<string>('action_payload');
  }

  getCostType(): CostTypeValue {
    return (this.get<string>('cost_type') as CostTypeValue) ?? CostType.CPV;
  }

  getCostValue(): number {
    return this.get<number>('cost_value') ?? 0;
  }

  getCostCurrency(): string | undefined {
    return this.get<string>('cost_currency');
  }

  getTrafficSourceId(): number | undefined {
    return this.get<number>('traffic_source_id');
  }

  getDomainId(): number | undefined {
    return this.get<number>('domain_id');
  }

  getParameters(): Record<string, unknown> | undefined {
    return this.get<Record<string, unknown>>('parameters');
  }

  getTrafficLoss(): number {
    return this.get<number>('traffic_loss') ?? 0;
  }

  getNotes(): string | undefined {
    return this.get<string>('notes');
  }

  // === Type checks ===

  isTypePosition(): boolean {
    return this.getType() === CampaignType.POSITION;
  }

  isWeightPosition(): boolean {
    return this.getType() === CampaignType.WEIGHT;
  }

  isDisabled(): boolean {
    return this.getState() === EntityState.DISABLED;
  }

  isUniqueByIpUa(): boolean {
    return this.getUniquenessMethod() !== UniqueCheckMethod.IP;
  }

  isUniqueByIp(): boolean {
    return this.getUniquenessMethod() === UniqueCheckMethod.IP;
  }

  isUniquenessUseCookies(): boolean {
    return this.get<number>('uniqueness_use_cookies') === 1;
  }

  isCostAuto(): boolean {
    return this.get<number>('cost_auto') === 1;
  }

  isCostPerUnique(): boolean {
    return [CostType.CPUC, 'CPUV'].includes(this.getCostType());
  }

  isCostPerThousand(): boolean {
    return this.getCostType() === CostType.CPM;
  }

  isCostPerClick(): boolean {
    const clickTypes = [CostType.CPC, CostType.CPV] as const;
    return clickTypes.includes(this.getCostType() as typeof clickTypes[number]);
  }

  isCostPerAcquisition(): boolean {
    return this.getCostType() === CostType.CPA;
  }

  isCostPerSale(): boolean {
    return this.getCostType() === CostType.CPS;
  }

  isCostRevShare(): boolean {
    return this.getCostType() === CostType.REV_SHARE;
  }

  isBindVisitorsEnabled(): boolean {
    const bind = this.get<string>('bind_visitors');
    return this.isWeightPosition() && !!bind && bind.length > 0;
  }

  isBindVisitorsLandingEnabled(): boolean {
    const bind = this.get<string>('bind_visitors');
    return this.isWeightPosition() && !!bind && bind.length >= 2;
  }

  isBindVisitorsOfferEnabled(): boolean {
    const bind = this.get<string>('bind_visitors');
    return this.isWeightPosition() && !!bind && bind.length >= 3;
  }

  // === Bot Handling ===

  /**
   * Get action to take for bot traffic
   * Options: 404, show_text, http_redirect, do_nothing
   */
  getActionForBots(): string {
    return this.get<string>('action_for_bots') ?? '404';
  }

  /**
   * Get redirect URL for bots
   */
  getBotRedirectUrl(): string | undefined {
    return this.get<string>('bot_redirect_url');
  }

  /**
   * Get text to show for bots
   */
  getBotText(): string | undefined {
    return this.get<string>('bot_text');
  }

  // === Setters ===

  setPosition(value: number): this {
    return this.set('position', value);
  }

  setActionPayload(value: string): this {
    return this.set('action_payload', value);
  }
}
