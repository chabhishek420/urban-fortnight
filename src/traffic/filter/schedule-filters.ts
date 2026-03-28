/**
 * Schedule Filters
 * 
 * Time-based filters for scheduling traffic.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Schedule.php
 * @see keitaro_source/application/Component/StreamFilters/Filter/Interval.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter, FilterModeValue } from '../model/stream-filter';
import { FilterMode } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';

/**
 * Day schedule interface
 * Supports both new format (array) and old format (single number)
 */
interface DayScheduleRaw {
  day: number | [number, number]; // Old format: single number, New format: [start, end]
  time?: [string, string]; // Start and end time (HH:mm format)
}

interface DaySchedule {
  day: [number, number]; // Normalized: Start and end day (0-6, where 0 is Monday)
  time?: [string, string]; // Start and end time (HH:mm format)
}

/**
 * Schedule payload interface
 */
interface SchedulePayload {
  intervals?: DayScheduleRaw[];
  timezone?: string;
}

/**
 * Interval payload interface
 */
interface IntervalPayload {
  from?: string;
  to?: string;
  timezone?: string;
}

/**
 * Schedule Filter
 * 
 * Filters clicks based on day-of-week and time schedules.
 * Supports timezone-aware scheduling.
 */
export class ScheduleFilter extends AbstractFilter {
  getKey(): string {
    return 'schedule';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.SCHEDULE;
  }

  getTooltip(): string {
    return 'Filter by day of week and time of day';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const payload = this.preparePayload(filter.getPayload() as SchedulePayload);
    let result = false;

    if (payload.intervals && payload.intervals.length > 0) {
      for (const dayScheduleRaw of payload.intervals) {
        // Convert old format (single day) to new format (day range)
        const daySchedule = this.convertOldFormat(dayScheduleRaw);
        if (this.isThatDayAndTime(rawClick.getDatetime(), daySchedule, payload.timezone)) {
          result = true;
          break;
        }
      }
    }

    return this.applyMode(result, filter.getMode());
  }

  /**
   * Convert old format where day is a single number
   * @see keitaro_source Schedule.php _convertOldFormat()
   */
  private convertOldFormat(raw: DayScheduleRaw): DaySchedule {
    if (typeof raw.day === 'number') {
      const result: DaySchedule = {
        day: [raw.day, raw.day]
      };
      if (raw.time !== undefined) {
        result.time = raw.time;
      }
      return result;
    }
    return raw as DaySchedule;
  }

  /**
   * Prepare payload, handling old format
   */
  private preparePayload(payload: SchedulePayload): SchedulePayload {
    if (!payload) {
      return { intervals: [] };
    }
    
    if (!payload.intervals) {
      const result: SchedulePayload = { intervals: [] };
      if (payload.timezone !== undefined) {
        result.timezone = payload.timezone;
      }
      return result;
    }
    
    return payload;
  }

  /**
   * Check if the given time matches the day schedule
   */
  private isThatDayAndTime(
    time: Date, 
    daySchedule: DaySchedule, 
    timezone?: string
  ): boolean {
    // Create a copy for timezone conversion
    let checkTime = time;
    
    if (timezone) {
      try {
        checkTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
      } catch {
        // Invalid timezone, use original time
      }
    }

    // Get day of week (0 = Sunday in JS, but we want 0 = Monday)
    let currentDay = checkTime.getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    currentDay = currentDay === 0 ? 6 : currentDay - 1;

    const currentTime = this.formatTime(checkTime);
    const [startDay, endDay] = daySchedule.day;

    // Check day range
    if (startDay <= endDay) {
      // Normal range (e.g., Monday to Friday: 0-4)
      if (currentDay < startDay || currentDay > endDay) {
        return false;
      }
      // If in the middle of the range, it's a match
      if (currentDay > startDay && currentDay < endDay) {
        return true;
      }
    } else {
      // Wrapped range (e.g., Friday to Monday: 4-0)
      if (currentDay > endDay && currentDay < startDay) {
        return false;
      }
      // If in the middle (outside the excluded range), it's a match
      if (currentDay < endDay || currentDay > startDay) {
        return true;
      }
    }

    // Check time range for boundary days
    if (!daySchedule.time) {
      return true;
    }

    const [startTime, endTime] = daySchedule.time;

    if (startDay <= endDay) {
      // Normal range
      const isStartDay = currentDay === startDay;
      const isEndDay = currentDay === endDay;
      
      if (isStartDay && isEndDay) {
        // Same day - check time window
        return currentTime >= startTime && currentTime <= endTime;
      } else if (isStartDay) {
        return currentTime >= startTime;
      } else if (isEndDay) {
        return currentTime <= endTime;
      }
      return true;
    } else {
      // Wrapped range
      const isEndDay = currentDay === endDay;
      const isStartDay = currentDay === startDay;
      
      if (isEndDay) {
        return currentTime <= endTime;
      } else if (isStartDay) {
        return currentTime >= startTime;
      }
      return true;
    }
  }

  /**
   * Format time as HH:mm
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Apply filter mode to result
   */
  private applyMode(result: boolean, mode: FilterModeValue): boolean {
    return mode === FilterMode.ACCEPT ? result : !result;
  }
}

/**
 * Interval Filter
 * 
 * Filters clicks based on date range (from-to dates).
 */
export class IntervalFilter extends AbstractFilter {
  getKey(): string {
    return 'interval';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.SCHEDULE;
  }

  getTooltip(): string {
    return 'Filter by date range (from-to)';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const payload = filter.getPayload() as IntervalPayload;
    
    if (!payload) {
      return true;
    }

    const currentTime = rawClick.getDatetime();
    let tz: string | undefined;
    
    if (payload.timezone) {
      tz = payload.timezone;
    }

    let include = true;

    // Check from date
    if (payload.from) {
      const fromDate = this.parseDate(payload.from, tz);
      if (fromDate) {
        fromDate.setHours(0, 0, 0, 0);
        include = fromDate <= currentTime;
      }
    }

    // Check to date
    if (payload.to && include) {
      const toDate = this.parseDate(payload.to, tz);
      if (toDate) {
        toDate.setHours(23, 59, 59, 999);
        include = currentTime <= toDate;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? include : !include;
  }

  /**
   * Parse date string (supports ISO format and simple YYYY-MM-DD)
   */
  private parseDate(dateStr: string, timezone?: string): Date | null {
    try {
      // Handle ISO format with T separator
      const parts = dateStr.split('T');
      const datePart = parts[0] ?? dateStr;
      
      const date = new Date(datePart + 'T00:00:00');
      
      if (timezone) {
        // Adjust for timezone
        try {
          const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
          return tzDate;
        } catch {
          return date;
        }
      }
      
      return date;
    } catch {
      return null;
    }
  }
}
