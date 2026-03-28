"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
/**
 * Config Service
 *
 * Manages application configuration settings.
 *
 * @see keitaro_source/application/Traffic/Service/ConfigService.php
 */
const abstract_service_js_1 = require("./abstract-service.js");
class ConfigService extends abstract_service_js_1.AbstractService {
    _config = new Map();
    // Configuration keys
    static SANDBOX_ENGINE = 'sandbox_engine';
    static SANDBOX_FPM_PATH = 'sandbox_fpm_path';
    static SANDBOX_FCGI_PATH = 'sandbox_fcgi_path';
    /**
     * Initialize configuration from an object
     */
    init(config) {
        for (const [scope, values] of Object.entries(config)) {
            this._config.set(scope, { ...values });
        }
    }
    /**
     * Set a configuration value
     */
    set(scope, key, value) {
        if (!this._config.has(scope)) {
            this._config.set(scope, {});
        }
        this._config.get(scope)[key] = value;
    }
    /**
     * Get a configuration value
     */
    get(scope, key, defaultValue) {
        if (this.has(scope, key)) {
            const scopeData = this._config.get(scope);
            if (key !== undefined) {
                return scopeData[key];
            }
            return scopeData;
        }
        return defaultValue;
    }
    /**
     * Delete a configuration value
     */
    delete(scope, key) {
        const scopeData = this._config.get(scope);
        if (scopeData) {
            delete scopeData[key];
        }
    }
    /**
     * Check if a configuration value exists
     */
    has(scope, key) {
        const scopeData = this._config.get(scope);
        if (!scopeData) {
            return false;
        }
        if (key === undefined) {
            return true;
        }
        return key in scopeData;
    }
    /**
     * Get debug value
     */
    getDebugValue() {
        return this.get('system', 'debug') === 1;
    }
    /**
     * Check if running in demo mode
     */
    isDemo() {
        return this.get('system', 'demo') === 1;
    }
    /**
     * Check if referrer redefine is allowed
     */
    isReferrerRedefineAllowed() {
        return this.get('system', 'allow_change_referrer') === true;
    }
    /**
     * Get all configuration as plain object
     */
    getAll() {
        const result = {};
        for (const [scope, values] of this._config) {
            result[scope] = { ...values };
        }
        return result;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config-service.js.map