/**
 * Click Repository
 *
 * Handles database operations for clicks.
 *
 * @see keitaro_source/application/Traffic/Repository/ClickRepository.php
 */
import { RawClick } from '../model/raw-click';
import type { Click } from '@prisma/client';
/**
 * Click Repository
 */
export declare class ClickRepository {
    private static instance;
    static getInstance(): ClickRepository;
    /**
     * Create a new click from RawClick data
     */
    create(rawClick: RawClick): Promise<Click>;
    /**
     * Create multiple clicks at once
     */
    createMany(rawClicks: RawClick[]): Promise<number>;
    /**
     * Find click by sub_id
     */
    findBySubId(subId: string): Promise<Click | null>;
    /**
     * Find click by ID
     */
    findById(id: number): Promise<Click | null>;
    /**
     * Update click
     */
    update(id: number, data: Partial<Click>): Promise<Click>;
    /**
     * Update click by sub_id
     */
    updateBySubId(subId: string, data: Partial<Click>): Promise<Click>;
    /**
     * Check if click exists for visitor in campaign (uniqueness check)
     */
    existsForCampaign(visitorId: number, campaignId: number): Promise<boolean>;
    /**
     * Check if click exists for visitor in stream (uniqueness check)
     */
    existsForStream(visitorId: number, streamId: number): Promise<boolean>;
    /**
     * Check if click exists for visitor globally (uniqueness check)
     */
    existsGlobal(visitorId: number): Promise<boolean>;
    /**
     * Get clicks count for campaign
     */
    countByCampaign(campaignId: number, since?: Date): Promise<number>;
    /**
     * Get clicks count for stream
     */
    countByStream(streamId: number, since?: Date): Promise<number>;
    /**
     * Get clicks for time period
     */
    findByDateRange(start: Date, end: Date, limit?: number): Promise<Click[]>;
    /**
     * Delete old clicks
     */
    deleteOlderThan(date: Date): Promise<number>;
    /**
     * Generate unique sub_id
     */
    private generateSubId;
    /**
     * Mark click as conversion (sale/lead/rejected)
     */
    markConversion(subId: string, type: 'sale' | 'lead' | 'rejected', revenue?: number): Promise<Click>;
    /**
     * Increment rebills count
     */
    incrementRebills(subId: string, revenue?: number): Promise<Click>;
}
//# sourceMappingURL=click-repository.d.ts.map