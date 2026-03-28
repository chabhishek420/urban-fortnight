/**
 * GeoDB Repository
 *
 * Manages available GeoIP databases.
 *
 * @see keitaro_source/application/Traffic/GeoDb/Repository/GeoDbRepository.php
 */
import { AbstractGeoDb } from './geo-db-service.js';
/**
 * GeoDB Repository class
 */
export declare class GeoDbRepository {
    private static _instance;
    private _dbs;
    private constructor();
    /**
     * Get singleton instance
     */
    static instance(): GeoDbRepository;
    /**
     * Initialize default databases
     */
    private init;
    /**
     * Get all databases
     */
    all(): AbstractGeoDb[];
    /**
     * Add a database
     */
    addDb(db: AbstractGeoDb): void;
    /**
     * Set all databases
     */
    setDbs(dbs: AbstractGeoDb[]): void;
    /**
     * Check if a database is available
     */
    isAvailable(id: string): boolean;
    /**
     * Get a database by ID
     */
    getDb(id: string): AbstractGeoDb;
    /**
     * Get database info
     */
    getDbInfo(id: string): AbstractGeoDb;
    /**
     * Check if a data type is available
     */
    isDataTypeAvailable(dataType: string): boolean;
    /**
     * Get database for a specific data type
     */
    getDbForDataType(dataType: string): AbstractGeoDb | undefined;
    /**
     * Reset the singleton (for testing)
     */
    static reset(): void;
}
//# sourceMappingURL=geo-db-repository.d.ts.map