/**
 * GeoDB Service
 *
 * Provides GeoIP lookup functionality.
 *
 * @see keitaro_source/application/Traffic/GeoDb/Service/GeoDbService.php
 */
import { AbstractService } from '../service/abstract-service.js';
import { type IpInfoTypeValue } from './ip-info-type.js';
import type { IpInfo } from '../service/raw-click-service.js';
export interface GeoDbDefinition {
    id: string;
    name: string;
    dataTypes: IpInfoTypeValue[];
    isPremium: boolean;
}
export interface GeoDbAdapter {
    info(ip: string): Promise<IpInfo>;
    rawInfo?(ip: string): Promise<Record<string, unknown>>;
}
export declare abstract class AbstractGeoDb {
    protected _definition: GeoDbDefinition;
    protected _exists: boolean;
    constructor(definition: GeoDbDefinition);
    definition(): GeoDbDefinition;
    exists(): boolean;
    abstract adapter(): GeoDbAdapter;
    abstract manager(): GeoDbManager;
}
export interface GeoDbManager {
    update(): Promise<void>;
    delete(): Promise<void>;
}
export declare class GeoDbService extends AbstractService {
    private _settings;
    private _databases;
    /**
     * Update a specific GeoDB database
     */
    update(db: AbstractGeoDb): Promise<void>;
    /**
     * Delete a specific GeoDB database
     */
    delete(db: AbstractGeoDb): Promise<void>;
    /**
     * Update multiple databases
     */
    updateMany(dbs: AbstractGeoDb[]): Promise<void>;
    /**
     * Get GeoDB settings
     */
    settings(): Record<string, string>;
    /**
     * Set GeoDB settings
     */
    saveSettings(settings: Record<string, string>): void;
    /**
     * Set database for a data type
     */
    setDbForDataType(dataType: string, dbId: string): void;
    /**
     * Get IP information from a specific database
     */
    info(db: AbstractGeoDb, ip: string): Promise<IpInfo>;
    /**
     * Get raw IP information
     */
    rawInfo(db: AbstractGeoDb, ip: string): Promise<Record<string, unknown>>;
    /**
     * Check if a database can resolve a data type
     */
    canDbResolveDataType(dataType: string, db: AbstractGeoDb, dbBySettings?: AbstractGeoDb | null): boolean;
    /**
     * Get IP info from the best available database
     */
    getIpInfo(ip: string): Promise<IpInfo>;
    /**
     * Register a database
     */
    registerDb(db: AbstractGeoDb): void;
    /**
     * Get a database by ID
     */
    getDb(id: string): AbstractGeoDb | undefined;
    /**
     * Get all registered databases
     */
    getAllDbs(): AbstractGeoDb[];
    /**
     * Get database for a specific data type
     */
    getDbForDataType(dataType: string): AbstractGeoDb | undefined;
    /**
     * Check if a data type is available
     */
    isDataTypeAvailable(dataType: string): boolean;
}
//# sourceMappingURL=geo-db-service.d.ts.map