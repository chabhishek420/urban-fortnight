/**
 * Conversion Model
 * 
 * @see keitaro_source/application/Traffic/Model/Conversion.php
 */
import { AbstractModel } from '../../core/model/abstract-model';

export type ConversionStatus = 'lead' | 'sale' | 'rejected' | 'rebill';

export class Conversion extends AbstractModel {
  protected static _tableName = 'conversions_2';
  protected static _cacheKey = 'CONVERSIONS';
  protected static _aclKey = 'conversions';
  protected static _entityName = 'conversion';

  getSubId(): string {
    return this.get<string>('sub_id') ?? '';
  }

  getTid(): string | undefined {
    return this.get<string>('tid');
  }

  getStatus(): ConversionStatus | undefined {
    return this.get<ConversionStatus>('status');
  }

  getPreviousStatus(): ConversionStatus | undefined {
    return this.get<ConversionStatus>('previous_status');
  }

  getOriginalStatus(): ConversionStatus | undefined {
    return this.get<ConversionStatus>('original_status');
  }

  getRevenue(): number {
    return this.get<number>('revenue') ?? 0;
  }

  getCost(): number {
    return this.get<number>('cost') ?? 0;
  }

  getCampaignId(): number | undefined {
    return this.get<number>('campaign_id');
  }

  getStreamId(): number | undefined {
    return this.get<number>('stream_id');
  }

  getOfferId(): number | undefined {
    return this.get<number>('offer_id');
  }

  getLandingId(): number | undefined {
    return this.get<number>('landing_id');
  }

  getClickId(): number | undefined {
    return this.get<number>('click_id');
  }

  getVisitorId(): bigint | undefined {
    return this.get<bigint>('visitor_id');
  }

  getClickDatetime(): Date | undefined {
    return this.get<Date>('click_datetime');
  }

  getPostbackDatetime(): Date | undefined {
    return this.get<Date>('postback_datetime');
  }

  getSaleDatetime(): Date | undefined {
    return this.get<Date>('sale_datetime');
  }

  isProcessed(): boolean {
    return this.get<number>('is_processed') === 1;
  }

  getParams(): Record<string, unknown> | undefined {
    const params = this.get<string>('params');
    try {
      return params ? JSON.parse(params) : undefined;
    } catch {
      return undefined;
    }
  }

  isLead(): boolean {
    return this.getStatus() === 'lead';
  }

  isSale(): boolean {
    return this.getStatus() === 'sale';
  }

  isRejected(): boolean {
    return this.getStatus() === 'rejected';
  }

  isRebill(): boolean {
    return this.getStatus() === 'rebill';
  }

  getProfit(): number {
    return this.getRevenue() - this.getCost();
  }
}
