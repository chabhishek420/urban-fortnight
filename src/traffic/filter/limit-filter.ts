/**
 * Limit Filter
 * 
 * Filters clicks based on stream hit limits.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Limit.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';

/**
 * Limit payload interface
 */
interface LimitPayload {
  per_hour?: number;
  per_day?: number;
  total?: number;
}

/**
 * Hit limit service interface (to be injected)
 */
export interface HitLimitService {
  perHour(streamId: number, date: Date): number;
  perDay(streamId: number, date: Date): number;
  total(streamId: number): number;
}

/**
 * Global hit limit service instance
 */
let hitLimitService: HitLimitService | null = null;

/**
 * Set the hit limit service instance
 */
export function setHitLimitService(service: HitLimitService): void {
  hitLimitService = service;
}

/**
 * Get the hit limit service instance
 */
export function getHitLimitService(): HitLimitService | null {
  return hitLimitService;
}

/**
 * Limit Filter
 * 
 * Filters clicks based on per-hour, per-day, and total hit limits.
 * Note: This filter doesn't use ACCEPT/REJECT modes - it always rejects
 * when limit is exceeded.
 */
export class LimitFilter extends AbstractFilter {
  getKey(): string {
    return 'limit';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.LIMITS;
  }

  getTooltip(): string {
    return 'Limit hits per hour, per day, or total';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const payload = filter.getPayload() as LimitPayload;
    
    if (!payload) {
      return true;
    }

    const streamId = filter.getStreamId();
    const service = getHitLimitService();
    
    if (!service) {
      // If no service is configured, allow the click
      this.log('HitLimitService not configured, allowing click');
      return true;
    }

    // Check if all limits are set to empty/zero
    if (this.checkNotSetValue(payload)) {
      return false;
    }

    const currentTime = rawClick.getDatetime();
    let limitExceeded = false;

    // Check per-hour limit
    if (payload.per_hour !== undefined && payload.per_hour !== null && payload.per_hour > 0) {
      const hourCount = service.perHour(streamId, currentTime);
      if (payload.per_hour <= hourCount) {
        this.log(`Per-hour limit exceeded: ${hourCount}/${payload.per_hour}`);
        limitExceeded = true;
      }
    }

    // Check per-day limit
    if (!limitExceeded && payload.per_day !== undefined && payload.per_day !== null && payload.per_day > 0) {
      const dayCount = service.perDay(streamId, currentTime);
      if (payload.per_day <= dayCount) {
        this.log(`Per-day limit exceeded: ${dayCount}/${payload.per_day}`);
        limitExceeded = true;
      }
    }

    // Check total limit
    if (!limitExceeded && payload.total !== undefined && payload.total !== null && payload.total > 0) {
      const totalCount = service.total(streamId);
      if (payload.total <= totalCount) {
        this.log(`Total limit exceeded: ${totalCount}/${payload.total}`);
        limitExceeded = true;
      }
    }

    return !limitExceeded;
  }

  /**
   * Check if all limit values are empty/zero
   */
  private checkNotSetValue(payload: LimitPayload): boolean {
    const hasPerHour = 'per_hour' in payload;
    const hasPerDay = 'per_day' in payload;
    const hasTotal = 'total' in payload;

    // If all three keys exist but all are empty/null/zero
    if (hasPerHour && hasPerDay && hasTotal) {
      const perHourEmpty = !payload.per_hour || payload.per_hour === 0;
      const perDayEmpty = !payload.per_day || payload.per_day === 0;
      const totalEmpty = !payload.total || payload.total === 0;

      if (perHourEmpty && perDayEmpty && totalEmpty) {
        return true;
      }
    }

    return false;
  }
}
