/**
 * Setting Model
 *
 * Key-value settings storage.
 *
 * @see keitaro_source/application/Traffic/Model/Setting.php
 */
import { AbstractModel } from '../../core/model/abstract-model';
export declare class Setting extends AbstractModel {
    protected static _tableName: string;
    protected static _entityName: string;
    static readonly API_KEY = "api_key";
    static readonly LICENSE_KEY = "license_key";
    static readonly TRAFFIC_LOG_ENABLED = "traffic_log_enabled";
    static readonly DEBUG_MODE = "debug_mode";
    static readonly TIMEZONE = "timezone";
    static readonly LANGUAGE = "language";
    static readonly CURRENCY = "currency";
    static readonly SMTP_SETTINGS = "smtp_settings";
    /**
     * Get setting key (used as identifier for settings)
     * Settings use string keys as identifiers instead of numeric IDs
     */
    getKey(): string;
    getValue(): string | undefined;
    getValueAsJson<T = unknown>(): T | undefined;
    getValueAsNumber(): number | undefined;
    getValueAsBoolean(): boolean;
    setValue(value: string | number | boolean | object): this;
}
//# sourceMappingURL=setting.d.ts.map