/**
 * Visitor Service
 *
 * Handles visitor identification and tracking.
 *
 * @see keitaro_source/application/Traffic/Service/VisitorService.php
 */
import { AbstractService } from './abstract-service.js';
import type { RawClick } from '../model/raw-click.js';
export declare class VisitorService extends AbstractService {
    /**
     * Generate a unique visitor code from raw click data
     * Uses murmurhash-like algorithm for consistent visitor identification
     */
    generateCode(rawClick: RawClick): string;
    /**
     * MurmurHash3 implementation for generating consistent hash
     */
    private murmurhash3;
    /**
     * Check if visitor matches a previous visit pattern
     */
    isReturningVisitor(visitorCode: string, storedCodes: string[]): boolean;
    /**
     * Generate a visitor ID from IP and user agent
     */
    generateVisitorId(ip: string, userAgent: string): string;
}
//# sourceMappingURL=visitor-service.d.ts.map