/**
 * Trigger Model
 * 
 * Represents a monitoring trigger in the system.
 * 
 * @see keitaro_source/application/Traffic/Model/Trigger.php
 */
import { AbstractModel } from '../../core/model/abstract-model';

/**
 * Trigger target constants
 */
export const TriggerTarget = {
  OFFER: 'offer',
  LANDING: 'landing'
} as const;

export type TriggerTargetValue = typeof TriggerTarget[keyof typeof TriggerTarget];

/**
 * Trigger condition constants
 */
export const TriggerCondition = {
  CONTAINS_TEXT: 'contains_text',
  NOT_CONTAINS_TEXT: 'not_contains_text',
  HTTP_STATUS: 'http_status',
  RESPONSE_TIME: 'response_time',
  REDIRECT_LOOP: 'redirect_loop',
  SSL_ERROR: 'ssl_error',
  TIMEOUT: 'timeout',
  REGEX_MATCH: 'regex_match'
} as const;

export type TriggerConditionValue = typeof TriggerCondition[keyof typeof TriggerCondition];

/**
 * Trigger action constants
 */
export const TriggerAction = {
  DISABLE: 'disable',
  NOTIFY: 'notify',
  SWITCH_TO_ALTERNATIVE: 'switch_to_alternative',
  ENABLE: 'enable'
} as const;

export type TriggerActionValue = typeof TriggerAction[keyof typeof TriggerAction];

/**
 * Trigger model class
 */
export class Trigger extends AbstractModel {
  protected static _tableName = 'triggers';
  protected static _cacheKey = 'TRIGGERS';
  protected static _aclKey = 'triggers';
  protected static _entityName = 'trigger';

  // === Getters ===

  getStreamId(): number {
    return this.get<number>('stream_id') ?? 0;
  }

  getTarget(): TriggerTargetValue {
    const target = this.get<string>('target');
    return (target as TriggerTargetValue) ?? TriggerTarget.OFFER;
  }

  getCondition(): TriggerConditionValue {
    const condition = this.get<string>('condition');
    return (condition as TriggerConditionValue) ?? TriggerCondition.CONTAINS_TEXT;
  }

  getSelectedPage(): string | undefined {
    return this.get<string>('selected_page');
  }

  getPattern(): string | undefined {
    return this.get<string>('pattern');
  }

  getAction(): TriggerActionValue {
    const action = this.get<string>('action');
    return (action as TriggerActionValue) ?? TriggerAction.NOTIFY;
  }

  getInterval(): number {
    return this.get<number>('interval') ?? 300; // Default 5 minutes
  }

  getNextRunAt(): number | undefined {
    return this.get<number>('next_run_at');
  }

  getAlternativeUrls(): string[] | undefined {
    const urls = this.get<string>('alternative_urls');
    if (!urls) return undefined;
    try {
      return JSON.parse(urls) as string[];
    } catch {
      return urls.split('\n').filter(u => u.trim().length > 0);
    }
  }

  getGrabFromPage(): string | undefined {
    return this.get<string>('grab_from_page');
  }

  getAvSettings(): Record<string, unknown> | undefined {
    const settings = this.get<string>('av_settings');
    if (!settings) return undefined;
    try {
      return JSON.parse(settings) as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }

  isReverse(): boolean {
    return this.get<number>('reverse') === 1;
  }

  isEnabled(): boolean {
    return this.get<number>('enabled') === 1;
  }

  getScanPage(): boolean {
    return this.get<number>('scan_page') === 1;
  }

  // === Target checks ===

  isOfferTarget(): boolean {
    return this.getTarget() === TriggerTarget.OFFER;
  }

  isLandingTarget(): boolean {
    return this.getTarget() === TriggerTarget.LANDING;
  }

  // === Condition checks ===

  isContainsTextCondition(): boolean {
    return this.getCondition() === TriggerCondition.CONTAINS_TEXT;
  }

  isNotContainsTextCondition(): boolean {
    return this.getCondition() === TriggerCondition.NOT_CONTAINS_TEXT;
  }

  isHttpStatusCondition(): boolean {
    return this.getCondition() === TriggerCondition.HTTP_STATUS;
  }

  isResponseTimeCondition(): boolean {
    return this.getCondition() === TriggerCondition.RESPONSE_TIME;
  }

  isRedirectLoopCondition(): boolean {
    return this.getCondition() === TriggerCondition.REDIRECT_LOOP;
  }

  isSslErrorCondition(): boolean {
    return this.getCondition() === TriggerCondition.SSL_ERROR;
  }

  isTimeoutCondition(): boolean {
    return this.getCondition() === TriggerCondition.TIMEOUT;
  }

  isRegexMatchCondition(): boolean {
    return this.getCondition() === TriggerCondition.REGEX_MATCH;
  }

  // === Action checks ===

  isDisableAction(): boolean {
    return this.getAction() === TriggerAction.DISABLE;
  }

  isNotifyAction(): boolean {
    return this.getAction() === TriggerAction.NOTIFY;
  }

  isSwitchToAlternativeAction(): boolean {
    return this.getAction() === TriggerAction.SWITCH_TO_ALTERNATIVE;
  }

  isEnableAction(): boolean {
    return this.getAction() === TriggerAction.ENABLE;
  }

  // === Setters ===

  setStreamId(value: number): this {
    return this.set('stream_id', value);
  }

  setTarget(value: TriggerTargetValue): this {
    return this.set('target', value);
  }

  setCondition(value: TriggerConditionValue): this {
    return this.set('condition', value);
  }

  setPattern(value: string): this {
    return this.set('pattern', value);
  }

  setAction(value: TriggerActionValue): this {
    return this.set('action', value);
  }

  setInterval(value: number): this {
    return this.set('interval', value);
  }

  setNextRunAt(value: number): this {
    return this.set('next_run_at', value);
  }

  setEnabled(value: boolean): this {
    return this.set('enabled', value ? 1 : 0);
  }

  setReverse(value: boolean): this {
    return this.set('reverse', value ? 1 : 0);
  }

  setAlternativeUrls(value: string[]): this {
    return this.set('alternative_urls', JSON.stringify(value));
  }
}
