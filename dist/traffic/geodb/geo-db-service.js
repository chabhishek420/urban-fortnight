"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoDbService = exports.AbstractGeoDb = void 0;
/**
 * GeoDB Service
 *
 * Provides GeoIP lookup functionality.
 *
 * @see keitaro_source/application/Traffic/GeoDb/Service/GeoDbService.php
 */
const abstract_service_js_1 = require("../service/abstract-service.js");
const ip_info_type_js_1 = require("./ip-info-type.js");
class AbstractGeoDb {
    _definition;
    _exists = false;
    constructor(definition) {
        this._definition = definition;
    }
    definition() {
        return this._definition;
    }
    exists() {
        return this._exists;
    }
}
exports.AbstractGeoDb = AbstractGeoDb;
class GeoDbService extends abstract_service_js_1.AbstractService {
    _settings = new Map();
    _databases = new Map();
    /**
     * Update a specific GeoDB database
     */
    async update(db) {
        await db.manager().update();
    }
    /**
     * Delete a specific GeoDB database
     */
    async delete(db) {
        await db.manager().delete();
    }
    /**
     * Update multiple databases
     */
    async updateMany(dbs) {
        const errors = [];
        for (const db of dbs) {
            if (db.exists()) {
                try {
                    await this.update(db);
                }
                catch (error) {
                    errors.push(error instanceof Error ? error.message : 'Unknown error');
                }
            }
        }
        if (errors.length > 0) {
            throw new Error(`GeoDB update errors: ${errors.join('; ')}`);
        }
    }
    /**
     * Get GeoDB settings
     */
    settings() {
        const result = {};
        for (const [key, value] of this._settings) {
            result[key] = value;
        }
        return result;
    }
    /**
     * Set GeoDB settings
     */
    saveSettings(settings) {
        for (const [key, value] of Object.entries(settings)) {
            this._settings.set(key, value);
        }
    }
    /**
     * Set database for a data type
     */
    setDbForDataType(dataType, dbId) {
        this._settings.set(dataType, dbId);
    }
    /**
     * Get IP information from a specific database
     */
    async info(db, ip) {
        if (db.exists()) {
            return db.adapter().info(ip);
        }
        return {};
    }
    /**
     * Get raw IP information
     */
    async rawInfo(db, ip) {
        try {
            if (db.adapter().rawInfo) {
                return db.adapter().rawInfo(ip);
            }
            return {};
        }
        catch (error) {
            console.error('GeoDB rawInfo error:', error);
            return {};
        }
    }
    /**
     * Check if a database can resolve a data type
     */
    canDbResolveDataType(dataType, db, dbBySettings) {
        if (!db.definition().dataTypes.includes(dataType)) {
            return false;
        }
        if (!dbBySettings) {
            return true;
        }
        // Compare adapter classes
        return true; // Simplified for TypeScript
    }
    /**
     * Get IP info from the best available database
     */
    async getIpInfo(ip) {
        const info = {};
        // Try to get country
        const countryDb = this.getDbForDataType(ip_info_type_js_1.IpInfoType.COUNTRY);
        if (countryDb) {
            const dbInfo = await this.info(countryDb, ip);
            Object.assign(info, dbInfo);
        }
        return info;
    }
    /**
     * Register a database
     */
    registerDb(db) {
        this._databases.set(db.definition().id, db);
    }
    /**
     * Get a database by ID
     */
    getDb(id) {
        return this._databases.get(id);
    }
    /**
     * Get all registered databases
     */
    getAllDbs() {
        return Array.from(this._databases.values());
    }
    /**
     * Get database for a specific data type
     */
    getDbForDataType(dataType) {
        const dbId = this._settings.get(dataType);
        if (dbId) {
            return this._databases.get(dbId);
        }
        // Find first database that supports this type
        for (const db of this._databases.values()) {
            if (db.definition().dataTypes.includes(dataType)) {
                return db;
            }
        }
        return undefined;
    }
    /**
     * Check if a data type is available
     */
    isDataTypeAvailable(dataType) {
        for (const db of this._databases.values()) {
            if (db.definition().dataTypes.includes(dataType)) {
                return true;
            }
        }
        return false;
    }
}
exports.GeoDbService = GeoDbService;
//# sourceMappingURL=geo-db-service.js.map