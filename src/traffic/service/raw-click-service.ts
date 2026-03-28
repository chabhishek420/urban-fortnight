/**
 * Raw Click Service
 * 
 * Handles raw click processing operations.
 * 
 * @see keitaro_source/application/Traffic/Service/RawClickService.php
 */
import { AbstractService } from './abstract-service';
import type { RawClick } from '../model/raw-click';
import type { GeoDbService } from '../geodb/geo-db-service';

export interface IpInfo {
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  connectionType?: string;
  operator?: string;
}

export class RawClickService extends AbstractService {
  static readonly INSERT_LIMIT = 1000;
  static readonly SUBID_LENGTH = 30;
  static readonly SUBID_SEQ_KEY = 'SUBIDSEQ';

  private _geoDbService: GeoDbService | null = null;
  private _subIdCounter: number = 0;

  /**
   * Set GeoDB service for IP resolution
   */
  public setGeoDbService(service: GeoDbService): void {
    this._geoDbService = service;
  }

  /**
   * Resolve geo information for a raw click
   */
  public async resolveGeo(rawClick: RawClick): Promise<void> {
    // Check if already resolved
    if (rawClick.get<boolean>('is_geo_resolved') || rawClick.getCountry()) {
      return;
    }

    rawClick.set('is_geo_resolved', true);

    if (!this._geoDbService) {
      return;
    }

    try {
      const ipInfo = await this._geoDbService.getIpInfo(rawClick.getIp());
      
      for (const [dataType, value] of Object.entries(ipInfo)) {
        rawClick.set(dataType, value);
      }

      // Handle Cloudflare country header override
      const cfCountry = rawClick.get<string>('cf_country');
      if (cfCountry) {
        rawClick.setCountry(cfCountry);
      }

      // Set cellular connection type if operator is present
      if (rawClick.get<string>('operator') && !rawClick.getConnectionType()) {
        rawClick.setConnectionType('cellular');
      }
    } catch (error) {
      console.error('Failed to resolve geo:', error);
    }
  }

  /**
   * Generate a unique sub ID for a click
   */
  public generateSubId(visitorCode: string): string {
    // In Keitaro PHP: base_convert(\Traffic\Redis\Service\RedisStorageService::instance()->incr(SUBIDSEQ), 10, 32);
    // Fallback: uniqid();
    // Here we use a counter converted to base32 + some randomness for unique sub_id within the length limit
    this._subIdCounter++;
    const randomness = this._subIdCounter.toString(32) + Math.random().toString(32).substring(2, 8);
    const subId = (visitorCode + randomness).substring(0, RawClickService.SUBID_LENGTH);
    return subId;
  }

  /**
   * Generate sub ID with custom prefix
   */
  public generateSubIdWithPrefix(prefix: string, length: number = RawClickService.SUBID_LENGTH): string {
    this._subIdCounter++;
    const counter = this._subIdCounter.toString(36).padStart(6, '0');
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    
    let subId = prefix + timestamp + counter + random;
    if (subId.length > length) {
      subId = subId.substring(0, length);
    }
    
    return subId.toLowerCase();
  }

  /**
   * Reset the sub ID counter (for testing)
   */
  public resetSubIdCounter(): void {
    this._subIdCounter = 0;
  }

  /**
   * Parse IP string to numeric representation
   */
  public ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) {
      return 0;
    }
    return ((parts[0] ?? 0) << 24) + ((parts[1] ?? 0) << 16) + ((parts[2] ?? 0) << 8) + (parts[3] ?? 0);
  }

  /**
   * Convert numeric IP to string
   */
  public numberToIp(num: number): string {
    return [
      (num >>> 24) & 0xFF,
      (num >>> 16) & 0xFF,
      (num >>> 8) & 0xFF,
      num & 0xFF
    ].join('.');
  }

  /**
   * Check if IP is in private range
   */
  public isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) {
      return false;
    }
    
    const p0 = parts[0] ?? 0;
    const p1 = parts[1] ?? 0;
    
    // 10.0.0.0 - 10.255.255.255
    if (p0 === 10) return true;
    
    // 172.16.0.0 - 172.31.255.255
    if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;
    
    // 192.168.0.0 - 192.168.255.255
    if (p0 === 192 && p1 === 168) return true;
    
    // 127.0.0.0 - 127.255.255.255 (localhost)
    if (p0 === 127) return true;
    
    return false;
  }
}
