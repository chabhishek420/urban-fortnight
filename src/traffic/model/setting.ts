/**
 * Setting Model
 * 
 * Key-value settings storage.
 * 
 * @see keitaro_source/application/Traffic/Model/Setting.php
 */
import { AbstractModel } from '../../core/model/abstract-model';

export class Setting extends AbstractModel {
  protected static _tableName = 'settings';
  protected static _entityName = 'setting';

  // Setting key constants
  static readonly API_KEY = 'api_key';
  static readonly LICENSE_KEY = 'license_key';
  static readonly TRAFFIC_LOG_ENABLED = 'traffic_log_enabled';
  static readonly DEBUG_MODE = 'debug_mode';
  static readonly TIMEZONE = 'timezone';
  static readonly LANGUAGE = 'language';
  static readonly CURRENCY = 'currency';
  static readonly SMTP_SETTINGS = 'smtp_settings';

  /**
   * Get setting key (used as identifier for settings)
   * Settings use string keys as identifiers instead of numeric IDs
   */
  getKey(): string {
    return this.get<string>('key') ?? '';
  }

  getValue(): string | undefined {
    return this.get<string>('value');
  }

  getValueAsJson<T = unknown>(): T | undefined {
    const value = this.getValue();
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  getValueAsNumber(): number | undefined {
    const value = this.getValue();
    return value ? parseFloat(value) : undefined;
  }

  getValueAsBoolean(): boolean {
    const value = this.getValue();
    return value === '1' || value === 'true' || value === 'yes';
  }

  setValue(value: string | number | boolean | object): this {
    const stringValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value);
    return this.set('value', stringValue);
  }
}
