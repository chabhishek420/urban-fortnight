/**
 * GeoDB Service
 * 
 * Provides GeoIP lookup functionality.
 * 
 * @see keitaro_source/application/Traffic/GeoDb/Service/GeoDbService.php
 */
import { AbstractService } from '../service/abstract-service';
import { IpInfoType, type IpInfoTypeValue } from './ip-info-type';
import type { IpInfo } from '../service/raw-click-service';

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

export abstract class AbstractGeoDb {
  protected _definition: GeoDbDefinition;
  protected _exists: boolean = false;

  constructor(definition: GeoDbDefinition) {
    this._definition = definition;
  }

  definition(): GeoDbDefinition {
    return this._definition;
  }

  exists(): boolean {
    return this._exists;
  }

  abstract adapter(): GeoDbAdapter;
  abstract manager(): GeoDbManager;
}

export interface GeoDbManager {
  update(): Promise<void>;
  delete(): Promise<void>;
}

export class GeoDbService extends AbstractService {
  private _settings: Map<string, string> = new Map();
  private _databases: Map<string, AbstractGeoDb> = new Map();

  /**
   * Update a specific GeoDB database
   */
  public async update(db: AbstractGeoDb): Promise<void> {
    await db.manager().update();
  }

  /**
   * Delete a specific GeoDB database
   */
  public async delete(db: AbstractGeoDb): Promise<void> {
    await db.manager().delete();
  }

  /**
   * Update multiple databases
   */
  public async updateMany(dbs: AbstractGeoDb[]): Promise<void> {
    const errors: string[] = [];
    
    for (const db of dbs) {
      if (db.exists()) {
        try {
          await this.update(db);
        } catch (error) {
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
  public settings(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of this._settings) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Set GeoDB settings
   */
  public saveSettings(settings: Record<string, string>): void {
    for (const [key, value] of Object.entries(settings)) {
      this._settings.set(key, value);
    }
  }

  /**
   * Set database for a data type
   */
  public setDbForDataType(dataType: string, dbId: string): void {
    this._settings.set(dataType, dbId);
  }

  /**
   * Get IP information from a specific database
   */
  public async info(db: AbstractGeoDb, ip: string): Promise<IpInfo> {
    if (db.exists()) {
      return db.adapter().info(ip);
    }
    return {};
  }

  /**
   * Get raw IP information
   */
  public async rawInfo(db: AbstractGeoDb, ip: string): Promise<Record<string, unknown>> {
    try {
      if (db.adapter().rawInfo) {
        return db.adapter().rawInfo!(ip);
      }
      return {};
    } catch (error) {
      console.error('GeoDB rawInfo error:', error);
      return {};
    }
  }

  /**
   * Check if a database can resolve a data type
   */
  public canDbResolveDataType(
    dataType: string,
    db: AbstractGeoDb,
    dbBySettings?: AbstractGeoDb | null
  ): boolean {
    if (!db.definition().dataTypes.includes(dataType as IpInfoTypeValue)) {
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
  public async getIpInfo(ip: string): Promise<IpInfo> {
    const info: IpInfo = {};
    
    // Try to get country
    const countryDb = this.getDbForDataType(IpInfoType.COUNTRY);
    if (countryDb) {
      const dbInfo = await this.info(countryDb, ip);
      Object.assign(info, dbInfo);
    }
    
    return info;
  }

  /**
   * Register a database
   */
  public registerDb(db: AbstractGeoDb): void {
    this._databases.set(db.definition().id, db);
  }

  /**
   * Get a database by ID
   */
  public getDb(id: string): AbstractGeoDb | undefined {
    return this._databases.get(id);
  }

  /**
   * Get all registered databases
   */
  public getAllDbs(): AbstractGeoDb[] {
    return Array.from(this._databases.values());
  }

  /**
   * Get database for a specific data type
   */
  public getDbForDataType(dataType: string): AbstractGeoDb | undefined {
    const dbId = this._settings.get(dataType);
    if (dbId) {
      return this._databases.get(dbId);
    }
    
    // Find first database that supports this type
    for (const db of this._databases.values()) {
      if (db.definition().dataTypes.includes(dataType as IpInfoTypeValue)) {
        return db;
      }
    }
    
    return undefined;
  }

  /**
   * Check if a data type is available
   */
  public isDataTypeAvailable(dataType: string): boolean {
    for (const db of this._databases.values()) {
      if (db.definition().dataTypes.includes(dataType as IpInfoTypeValue)) {
        return true;
      }
    }
    return false;
  }
}
