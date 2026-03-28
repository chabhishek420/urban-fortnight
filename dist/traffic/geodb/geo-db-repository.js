"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoDbRepository = void 0;
/**
 * GeoDB Repository
 *
 * Manages available GeoIP databases.
 *
 * @see keitaro_source/application/Traffic/GeoDb/Repository/GeoDbRepository.php
 */
const geo_db_service_js_1 = require("./geo-db-service.js");
const ip_info_type_js_1 = require("./ip-info-type.js");
/**
 * Built-in GeoIP database definitions
 */
const BUILTIN_DATABASES = [
    {
        id: 'ip2location_db3_lite',
        name: 'IP2Location DB3 Lite',
        dataTypes: [ip_info_type_js_1.IpInfoType.COUNTRY, ip_info_type_js_1.IpInfoType.REGION, ip_info_type_js_1.IpInfoType.CITY],
        isPremium: false
    },
    {
        id: 'ip2location_db3_full',
        name: 'IP2Location DB3 Full',
        dataTypes: [ip_info_type_js_1.IpInfoType.COUNTRY, ip_info_type_js_1.IpInfoType.REGION, ip_info_type_js_1.IpInfoType.CITY],
        isPremium: true
    },
    {
        id: 'maxmind_city_lite',
        name: 'MaxMind GeoLite2 City',
        dataTypes: [ip_info_type_js_1.IpInfoType.COUNTRY, ip_info_type_js_1.IpInfoType.REGION, ip_info_type_js_1.IpInfoType.CITY, ip_info_type_js_1.IpInfoType.LATITUDE, ip_info_type_js_1.IpInfoType.LONGITUDE],
        isPremium: false
    },
    {
        id: 'maxmind_city_full',
        name: 'MaxMind GeoIP2 City',
        dataTypes: [ip_info_type_js_1.IpInfoType.COUNTRY, ip_info_type_js_1.IpInfoType.REGION, ip_info_type_js_1.IpInfoType.CITY, ip_info_type_js_1.IpInfoType.LATITUDE, ip_info_type_js_1.IpInfoType.LONGITUDE],
        isPremium: true
    },
    {
        id: 'maxmind_isp',
        name: 'MaxMind GeoIP2 ISP',
        dataTypes: [ip_info_type_js_1.IpInfoType.ISP, ip_info_type_js_1.IpInfoType.ORGANIZATION, ip_info_type_js_1.IpInfoType.ASN],
        isPremium: true
    },
    {
        id: 'sypex_city_lite',
        name: 'Sypex Geo City Lite',
        dataTypes: [ip_info_type_js_1.IpInfoType.COUNTRY, ip_info_type_js_1.IpInfoType.REGION, ip_info_type_js_1.IpInfoType.CITY],
        isPremium: false
    },
    {
        id: 'keitaro_bot_db',
        name: 'Keitaro Bot Database',
        dataTypes: [ip_info_type_js_1.IpInfoType.IS_BOT],
        isPremium: false
    },
    {
        id: 'keitaro_carrier_db',
        name: 'Keitaro Carrier Database',
        dataTypes: [ip_info_type_js_1.IpInfoType.OPERATOR, ip_info_type_js_1.IpInfoType.CONNECTION_TYPE],
        isPremium: false
    }
];
/**
 * Simple GeoDB implementation for basic lookups
 */
class SimpleGeoDb extends geo_db_service_js_1.AbstractGeoDb {
    _adapter;
    constructor(definition) {
        super(definition);
        this._adapter = new SimpleGeoDbAdapter(definition);
        this._exists = true; // Assume exists for basic implementation
    }
    adapter() {
        return this._adapter;
    }
    manager() {
        return {
            update: async () => { },
            delete: async () => { }
        };
    }
}
/**
 * Simple GeoDB adapter for basic IP lookups
 */
class SimpleGeoDbAdapter {
    constructor(_definition) {
        // Definition is stored but not used in this placeholder implementation
    }
    async info(_ip) {
        // This is a placeholder implementation
        // Real implementation would query actual GeoIP databases
        return {};
    }
}
/**
 * GeoDB Repository class
 */
class GeoDbRepository {
    static _instance = null;
    _dbs = new Map();
    constructor() {
        this.init();
    }
    /**
     * Get singleton instance
     */
    static instance() {
        if (!GeoDbRepository._instance) {
            GeoDbRepository._instance = new GeoDbRepository();
        }
        return GeoDbRepository._instance;
    }
    /**
     * Initialize default databases
     */
    init() {
        for (const definition of BUILTIN_DATABASES) {
            const db = new SimpleGeoDb(definition);
            this._dbs.set(definition.id, db);
        }
    }
    /**
     * Get all databases
     */
    all() {
        return Array.from(this._dbs.values());
    }
    /**
     * Add a database
     */
    addDb(db) {
        this._dbs.set(db.definition().id, db);
    }
    /**
     * Set all databases
     */
    setDbs(dbs) {
        this._dbs.clear();
        for (const db of dbs) {
            this._dbs.set(db.definition().id, db);
        }
    }
    /**
     * Check if a database is available
     */
    isAvailable(id) {
        const db = this._dbs.get(id);
        return db ? db.exists() : false;
    }
    /**
     * Get a database by ID
     */
    getDb(id) {
        const db = this._dbs.get(id);
        if (!db) {
            throw new Error(`Unknown geo db "${id}" (available: ${Object.keys(this._dbs).join(', ')})`);
        }
        return db;
    }
    /**
     * Get database info
     */
    getDbInfo(id) {
        return this.getDb(id);
    }
    /**
     * Check if a data type is available
     */
    isDataTypeAvailable(dataType) {
        for (const db of this._dbs.values()) {
            if (db.definition().dataTypes.includes(dataType)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Get database for a specific data type
     */
    getDbForDataType(dataType) {
        const geoDbService = geo_db_service_js_1.GeoDbService.instance();
        const settings = geoDbService.settings();
        if (settings[dataType]) {
            return this._dbs.get(settings[dataType]);
        }
        // Find first database that supports this type
        for (const db of this._dbs.values()) {
            if (db.definition().dataTypes.includes(dataType)) {
                return db;
            }
        }
        return undefined;
    }
    /**
     * Reset the singleton (for testing)
     */
    static reset() {
        GeoDbRepository._instance = null;
    }
}
exports.GeoDbRepository = GeoDbRepository;
//# sourceMappingURL=geo-db-repository.js.map