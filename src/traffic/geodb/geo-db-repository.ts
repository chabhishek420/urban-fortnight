/**
 * GeoDB Repository
 * 
 * Manages available GeoIP databases.
 * 
 * @see keitaro_source/application/Traffic/GeoDb/Repository/GeoDbRepository.php
 */
import { GeoDbService, AbstractGeoDb, GeoDbDefinition, GeoDbAdapter, GeoDbManager } from './geo-db-service';
import { IpInfoType } from './ip-info-type';
import type { IpInfo } from '../service/raw-click-service';

/**
 * Built-in GeoIP database definitions
 */
const BUILTIN_DATABASES: GeoDbDefinition[] = [
  {
    id: 'ip2location_db3_lite',
    name: 'IP2Location DB3 Lite',
    dataTypes: [IpInfoType.COUNTRY, IpInfoType.REGION, IpInfoType.CITY],
    isPremium: false
  },
  {
    id: 'ip2location_db3_full',
    name: 'IP2Location DB3 Full',
    dataTypes: [IpInfoType.COUNTRY, IpInfoType.REGION, IpInfoType.CITY],
    isPremium: true
  },
  {
    id: 'maxmind_city_lite',
    name: 'MaxMind GeoLite2 City',
    dataTypes: [IpInfoType.COUNTRY, IpInfoType.REGION, IpInfoType.CITY, IpInfoType.LATITUDE, IpInfoType.LONGITUDE],
    isPremium: false
  },
  {
    id: 'maxmind_city_full',
    name: 'MaxMind GeoIP2 City',
    dataTypes: [IpInfoType.COUNTRY, IpInfoType.REGION, IpInfoType.CITY, IpInfoType.LATITUDE, IpInfoType.LONGITUDE],
    isPremium: true
  },
  {
    id: 'maxmind_isp',
    name: 'MaxMind GeoIP2 ISP',
    dataTypes: [IpInfoType.ISP, IpInfoType.ORGANIZATION, IpInfoType.ASN],
    isPremium: true
  },
  {
    id: 'sypex_city_lite',
    name: 'Sypex Geo City Lite',
    dataTypes: [IpInfoType.COUNTRY, IpInfoType.REGION, IpInfoType.CITY],
    isPremium: false
  },
  {
    id: 'keitaro_bot_db',
    name: 'Keitaro Bot Database',
    dataTypes: [IpInfoType.IS_BOT],
    isPremium: false
  },
  {
    id: 'keitaro_carrier_db',
    name: 'Keitaro Carrier Database',
    dataTypes: [IpInfoType.OPERATOR, IpInfoType.CONNECTION_TYPE],
    isPremium: false
  }
];

/**
 * Simple GeoDB implementation for basic lookups
 */
class SimpleGeoDb extends AbstractGeoDb {
  private _adapter: SimpleGeoDbAdapter;

  constructor(definition: GeoDbDefinition) {
    super(definition);
    this._adapter = new SimpleGeoDbAdapter(definition);
    this._exists = true; // Assume exists for basic implementation
  }

  adapter(): GeoDbAdapter {
    return this._adapter;
  }

  manager(): GeoDbManager {
    return {
      update: async () => { },
      delete: async () => { }
    };
  }
}

/**
 * Simple GeoDB adapter for basic IP lookups
 */
class SimpleGeoDbAdapter implements GeoDbAdapter {
  constructor(_definition: GeoDbDefinition) {
    // Definition is stored but not used in this placeholder implementation
  }

  async info(_ip: string): Promise<IpInfo> {
    // This is a placeholder implementation
    // Real implementation would query actual GeoIP databases
    return {};
  }
}

/**
 * GeoDB Repository class
 */
export class GeoDbRepository {
  private static _instance: GeoDbRepository | null = null;
  private _dbs: Map<string, AbstractGeoDb> = new Map();

  private constructor() {
    this.init();
  }

  /**
   * Get singleton instance
   */
  public static instance(): GeoDbRepository {
    if (!GeoDbRepository._instance) {
      GeoDbRepository._instance = new GeoDbRepository();
    }
    return GeoDbRepository._instance;
  }

  /**
   * Initialize default databases
   */
  private init(): void {
    for (const definition of BUILTIN_DATABASES) {
      const db = new SimpleGeoDb(definition);
      this._dbs.set(definition.id, db);
    }
  }

  /**
   * Get all databases
   */
  public all(): AbstractGeoDb[] {
    return Array.from(this._dbs.values());
  }

  /**
   * Add a database
   */
  public addDb(db: AbstractGeoDb): void {
    this._dbs.set(db.definition().id, db);
  }

  /**
   * Set all databases
   */
  public setDbs(dbs: AbstractGeoDb[]): void {
    this._dbs.clear();
    for (const db of dbs) {
      this._dbs.set(db.definition().id, db);
    }
  }

  /**
   * Check if a database is available
   */
  public isAvailable(id: string): boolean {
    const db = this._dbs.get(id);
    return db ? db.exists() : false;
  }

  /**
   * Get a database by ID
   */
  public getDb(id: string): AbstractGeoDb {
    const db = this._dbs.get(id);
    if (!db) {
      throw new Error(`Unknown geo db "${id}" (available: ${Object.keys(this._dbs).join(', ')})`);
    }
    return db;
  }

  /**
   * Get database info
   */
  public getDbInfo(id: string): AbstractGeoDb {
    return this.getDb(id);
  }

  /**
   * Check if a data type is available
   */
  public isDataTypeAvailable(dataType: string): boolean {
    for (const db of this._dbs.values()) {
      if (db.definition().dataTypes.includes(dataType as typeof IpInfoType[keyof typeof IpInfoType])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get database for a specific data type
   */
  public getDbForDataType(dataType: string): AbstractGeoDb | undefined {
    const geoDbService = GeoDbService.instance();
    const settings = geoDbService.settings();
    
    if (settings[dataType]) {
      return this._dbs.get(settings[dataType]);
    }
    
    // Find first database that supports this type
    for (const db of this._dbs.values()) {
      if (db.definition().dataTypes.includes(dataType as typeof IpInfoType[keyof typeof IpInfoType])) {
        return db;
      }
    }
    
    return undefined;
  }

  /**
   * Reset the singleton (for testing)
   */
  public static reset(): void {
    GeoDbRepository._instance = null;
  }
}
