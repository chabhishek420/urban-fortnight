/**
 * Trigger Model
 *
 * Represents a monitoring trigger in the system.
 *
 * @see keitaro_source/application/Traffic/Model/Trigger.php
 */
import { AbstractModel } from '../../core/model/abstract-model.js';
/**
 * Trigger target constants
 */
export declare const TriggerTarget: {
    readonly OFFER: "offer";
    readonly LANDING: "landing";
};
export type TriggerTargetValue = typeof TriggerTarget[keyof typeof TriggerTarget];
/**
 * Trigger condition constants
 */
export declare const TriggerCondition: {
    readonly CONTAINS_TEXT: "contains_text";
    readonly NOT_CONTAINS_TEXT: "not_contains_text";
    readonly HTTP_STATUS: "http_status";
    readonly RESPONSE_TIME: "response_time";
    readonly REDIRECT_LOOP: "redirect_loop";
    readonly SSL_ERROR: "ssl_error";
    readonly TIMEOUT: "timeout";
    readonly REGEX_MATCH: "regex_match";
};
export type TriggerConditionValue = typeof TriggerCondition[keyof typeof TriggerCondition];
/**
 * Trigger action constants
 */
export declare const TriggerAction: {
    readonly DISABLE: "disable";
    readonly NOTIFY: "notify";
    readonly SWITCH_TO_ALTERNATIVE: "switch_to_alternative";
    readonly ENABLE: "enable";
};
export type TriggerActionValue = typeof TriggerAction[keyof typeof TriggerAction];
/**
 * Trigger model class
 */
export declare class Trigger extends AbstractModel {
    protected static _tableName: string;
    protected static _cacheKey: string;
    protected static _aclKey: string;
    protected static _entityName: string;
    getStreamId(): number;
    getTarget(): TriggerTargetValue;
    getCondition(): TriggerConditionValue;
    getSelectedPage(): string | undefined;
    getPattern(): string | undefined;
    getAction(): TriggerActionValue;
    getInterval(): number;
    getNextRunAt(): number | undefined;
    getAlternativeUrls(): string[] | undefined;
    getGrabFromPage(): string | undefined;
    getAvSettings(): Record<string, unknown> | undefined;
    isReverse(): boolean;
    isEnabled(): boolean;
    getScanPage(): boolean;
    isOfferTarget(): boolean;
    isLandingTarget(): boolean;
    isContainsTextCondition(): boolean;
    isNotContainsTextCondition(): boolean;
    isHttpStatusCondition(): boolean;
    isResponseTimeCondition(): boolean;
    isRedirectLoopCondition(): boolean;
    isSslErrorCondition(): boolean;
    isTimeoutCondition(): boolean;
    isRegexMatchCondition(): boolean;
    isDisableAction(): boolean;
    isNotifyAction(): boolean;
    isSwitchToAlternativeAction(): boolean;
    isEnableAction(): boolean;
    setStreamId(value: number): this;
    setTarget(value: TriggerTargetValue): this;
    setCondition(value: TriggerConditionValue): this;
    setPattern(value: string): this;
    setAction(value: TriggerActionValue): this;
    setInterval(value: number): this;
    setNextRunAt(value: number): this;
    setEnabled(value: boolean): this;
    setReverse(value: boolean): this;
    setAlternativeUrls(value: string[]): this;
}
//# sourceMappingURL=trigger.d.ts.map