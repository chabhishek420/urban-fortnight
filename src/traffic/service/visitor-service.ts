/**
 * Visitor Service
 * 
 * Handles visitor identification and tracking.
 * 
 * @see keitaro_source/application/Traffic/Service/VisitorService.php
 */
import { AbstractService } from './abstract-service';
import type { RawClick } from '../model/raw-click';

export class VisitorService extends AbstractService {
  /**
   * Generate a unique visitor code from raw click data
   * Uses murmurhash-like algorithm for consistent visitor identification
   */
  public generateCode(rawClick: RawClick): string {
    const srcString = [
      rawClick.getIp() ?? '',
      rawClick.getUserAgent() ?? '',
      rawClick.getConnectionType() ?? '',
      rawClick.getCountry() ?? '',
      rawClick.getCity() ?? '',
      rawClick.getDeviceModel() ?? ''
    ].join('');

    return this.murmurhash3(srcString);
  }

  /**
   * MurmurHash3 implementation for generating consistent hash
   */
  private murmurhash3(str: string): string {
    let h = 0;
    
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
      h ^= h >>> 15;
    }
    
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 16;
    
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  /**
   * Check if visitor matches a previous visit pattern
   */
  public isReturningVisitor(visitorCode: string, storedCodes: string[]): boolean {
    return storedCodes.includes(visitorCode);
  }

  /**
   * Generate a visitor ID from IP and user agent
   */
  public generateVisitorId(ip: string, userAgent: string): string {
    const combined = `${ip}|${userAgent}`;
    return this.murmurhash3(combined);
  }
}
