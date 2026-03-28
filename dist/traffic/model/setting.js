"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
/**
 * Setting Model
 *
 * Key-value settings storage.
 *
 * @see keitaro_source/application/Traffic/Model/Setting.php
 */
const abstract_model_1 = require("../../core/model/abstract-model");
class Setting extends abstract_model_1.AbstractModel {
    static _tableName = 'settings';
    static _entityName = 'setting';
    // Setting key constants
    static API_KEY = 'api_key';
    static LICENSE_KEY = 'license_key';
    static TRAFFIC_LOG_ENABLED = 'traffic_log_enabled';
    static DEBUG_MODE = 'debug_mode';
    static TIMEZONE = 'timezone';
    static LANGUAGE = 'language';
    static CURRENCY = 'currency';
    static SMTP_SETTINGS = 'smtp_settings';
    /**
     * Get setting key (used as identifier for settings)
     * Settings use string keys as identifiers instead of numeric IDs
     */
    getKey() {
        return this.get('key') ?? '';
    }
    getValue() {
        return this.get('value');
    }
    getValueAsJson() {
        const value = this.getValue();
        if (!value)
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch {
            return undefined;
        }
    }
    getValueAsNumber() {
        const value = this.getValue();
        return value ? parseFloat(value) : undefined;
    }
    getValueAsBoolean() {
        const value = this.getValue();
        return value === '1' || value === 'true' || value === 'yes';
    }
    setValue(value) {
        const stringValue = typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
        return this.set('value', stringValue);
    }
}
exports.Setting = Setting;
//# sourceMappingURL=setting.js.map