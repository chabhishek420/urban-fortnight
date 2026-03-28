/**
 * Raw Click Service
 *
 * Handles raw click processing operations.
 *
 * @see keitaro_source/application/Traffic/Service/RawClickService.php
 */
import { AbstractService } from './abstract-service.js';
import type { RawClick } from '../model/raw-click.js';
import type { GeoDbService } from '../geodb/geo-db-service.js';
export interface IpInfo {
    country?: string;
    region?: string;
    city?: string;
    isp?: string;
    connectionType?: string;
    operator?: string;
}
export declare class RawClickService extends AbstractService {
    static readonly INSERT_LIMIT = 1000;
    static readonly SUBID_LENGTH = 30;
    static readonly SUBID_SEQ_KEY = "SUBIDSEQ";
    private _geoDbService;
    private _subIdCounter;
    /**
     * Set GeoDB service for IP resolution
     */
    setGeoDbService(service: GeoDbService): void;
    /**
     * Resolve geo information for a raw click
     */
    resolveGeo(rawClick: RawClick): Promise<void>;
    /**
     * Generate a unique sub ID for a click
     */
    generateSubId(visitorCode: string): string;
    /**
     * Generate sub ID with custom prefix
     */
    generateSubIdWithPrefix(prefix: string, length?: number): string;
    /**
     * Reset the sub ID counter (for testing)
     */
    resetSubIdCounter(): void;
    /**
     * Parse IP string to numeric representation
     */
    ipToNumber(ip: string): number;
    /**
     * Convert numeric IP to string
     */
    numberToIp(num: number): string;
    /**
     * Check if IP is in private range
     */
    isPrivateIp(ip: string): boolean;
}
//# sourceMappingURL=raw-click-service.d.ts.map