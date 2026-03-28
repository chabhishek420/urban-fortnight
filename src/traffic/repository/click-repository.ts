/**
 * Click Repository
 * 
 * Handles database operations for clicks.
 * 
 * @see keitaro_source/application/Traffic/Repository/ClickRepository.php
 */

import { getDb } from '../../lib/db';
import { RawClick } from '../model/raw-click';
import type { Click } from '@prisma/client';

const getClickDb = () => getDb().click;

/**
 * Click Repository
 */
export class ClickRepository {
  private static instance: ClickRepository;

  static getInstance(): ClickRepository {
    if (!ClickRepository.instance) {
      ClickRepository.instance = new ClickRepository();
    }
    return ClickRepository.instance;
  }

  /**
   * Create a new click from RawClick data
   */
  async create(rawClick: RawClick): Promise<Click> {
    const data = rawClick.getData();

    const click = await getClickDb().create({
      data: {
        visitorId: (data.visitor_id as number) ?? 0,
        subId: rawClick.getSubId() || this.generateSubId(),
        tsId: data.ts_id as number | null,
        landingId: rawClick.getLandingId() ?? null,
        landingClicked: false,
        offerId: rawClick.getOfferId() ?? null,
        affiliateNetworkId: rawClick.getAffiliateNetworkId() ?? null,
        datetime: rawClick.getDatetime(),
        campaignId: rawClick.getCampaignId() ?? 0,
        parentCampaignId: rawClick.getParentCampaignId() ?? null,
        streamId: rawClick.getStreamId() ?? null,
        isUniqueStream: rawClick.isUniqueStream(),
        isUniqueCampaign: rawClick.isUniqueCampaign(),
        isUniqueGlobal: rawClick.isUniqueGlobal(),
        isBot: rawClick.isBot(),
        isUsingProxy: rawClick.isProxy(),
        isEmptyReferrer: !rawClick.getReferrer(),
        sourceId: (data.source_id as number) ?? 0,
        referrerId: (data.referrer_id as number) ?? 0,
        cost: rawClick.getCost(),
        isLead: false,
        isSale: false,
        isRejected: false,
        rebills: 0,
      }
    });

    return click;
  }

  /**
   * Create multiple clicks at once
   */
  async createMany(rawClicks: RawClick[]): Promise<number> {
    const data = rawClicks.map(rawClick => {
      const d = rawClick.getData();
      return {
        visitorId: (d.visitor_id as number) ?? 0,
        subId: rawClick.getSubId() || this.generateSubId(),
        tsId: d.ts_id as number | null,
        landingId: rawClick.getLandingId() ?? null,
        landingClicked: false,
        offerId: rawClick.getOfferId() ?? null,
        affiliateNetworkId: rawClick.getAffiliateNetworkId() ?? null,
        datetime: rawClick.getDatetime(),
        campaignId: rawClick.getCampaignId() ?? 0,
        parentCampaignId: rawClick.getParentCampaignId() ?? null,
        streamId: rawClick.getStreamId() ?? null,
        isUniqueStream: rawClick.isUniqueStream(),
        isUniqueCampaign: rawClick.isUniqueCampaign(),
        isUniqueGlobal: rawClick.isUniqueGlobal(),
        isBot: rawClick.isBot(),
        isUsingProxy: rawClick.isProxy(),
        isEmptyReferrer: !rawClick.getReferrer(),
        sourceId: (d.source_id as number) ?? 0,
        referrerId: (d.referrer_id as number) ?? 0,
        cost: rawClick.getCost(),
        isLead: false,
        isSale: false,
        isRejected: false,
        rebills: 0,
      };
    });

    await getClickDb().createMany({ data });
    return data.length;
  }

  /**
   * Find click by sub_id
   */
  async findBySubId(subId: string): Promise<Click | null> {
    return getClickDb().findUnique({
      where: { subId }
    });
  }

  /**
   * Find click by ID
   */
  async findById(id: number): Promise<Click | null> {
    return getClickDb().findUnique({
      where: { clickId: id }
    });
  }

  /**
   * Update click
   */
  async update(id: number, data: Partial<Click>): Promise<Click> {
    return getClickDb().update({
      where: { clickId: id },
      data
    });
  }

  /**
   * Update click by sub_id
   */
  async updateBySubId(subId: string, data: Partial<Click>): Promise<Click> {
    return getClickDb().update({
      where: { subId },
      data
    });
  }

  /**
   * Check if click exists for visitor in campaign (uniqueness check)
   */
  async existsForCampaign(visitorId: number, campaignId: number): Promise<boolean> {
    const count = await getClickDb().count({
      where: {
        visitorId,
        campaignId
      }
    });
    return count > 0;
  }

  /**
   * Check if click exists for visitor in stream (uniqueness check)
   */
  async existsForStream(visitorId: number, streamId: number): Promise<boolean> {
    const count = await getClickDb().count({
      where: {
        visitorId,
        streamId
      }
    });
    return count > 0;
  }

  /**
   * Check if click exists for visitor globally (uniqueness check)
   */
  async existsGlobal(visitorId: number): Promise<boolean> {
    const count = await getClickDb().count({
      where: {
        visitorId
      }
    });
    return count > 0;
  }

  /**
   * Get clicks count for campaign
   */
  async countByCampaign(campaignId: number, since?: Date): Promise<number> {
    return getClickDb().count({
      where: {
        campaignId,
        ...(since && { datetime: { gte: since } })
      }
    });
  }

  /**
   * Get clicks count for stream
   */
  async countByStream(streamId: number, since?: Date): Promise<number> {
    return getClickDb().count({
      where: {
        streamId,
        ...(since && { datetime: { gte: since } })
      }
    });
  }

  /**
   * Get clicks for time period
   */
  async findByDateRange(start: Date, end: Date, limit: number = 1000): Promise<Click[]> {
    return getClickDb().findMany({
      where: {
        datetime: {
          gte: start,
          lte: end
        }
      },
      orderBy: { datetime: 'desc' },
      take: limit
    });
  }

  /**
   * Delete old clicks
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const result = await getClickDb().deleteMany({
      where: {
        datetime: { lt: date }
      }
    });
    return result.count;
  }

  /**
   * Generate unique sub_id
   */
  private generateSubId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Mark click as conversion (sale/lead/rejected)
   */
  async markConversion(
    subId: string,
    type: 'sale' | 'lead' | 'rejected',
    revenue: number = 0
  ): Promise<Click> {
    const updateData: Partial<Click> = {};

    switch (type) {
      case 'sale':
        updateData.isSale = true;
        updateData.saleRevenue = revenue;
        break;
      case 'lead':
        updateData.isLead = true;
        updateData.leadRevenue = revenue;
        break;
      case 'rejected':
        updateData.isRejected = true;
        updateData.rejectedRevenue = revenue;
        break;
    }

    return this.updateBySubId(subId, updateData);
  }

  /**
   * Increment rebills count
   */
  async incrementRebills(subId: string, revenue: number = 0): Promise<Click> {
    const click = await this.findBySubId(subId);
    if (!click) {
      throw new Error(`Click not found: ${subId}`);
    }

    return getClickDb().update({
      where: { subId },
      data: {
        rebills: { increment: 1 },
        saleRevenue: { increment: revenue }
      }
    });
  }
}
