/**
 * Stream Filter Model
 * 
 * @see keitaro_source/application/Traffic/Model/StreamFilter.php
 */
import { AbstractModel } from '../../core/model/abstract-model';

/**
 * Filter mode constants
 */
export const FilterMode = {
  ACCEPT: 'accept',
  REJECT: 'reject'
} as const;

export type FilterModeValue = typeof FilterMode[keyof typeof FilterMode];

/**
 * Stream filter data interface
 */
export interface StreamFilterData {
  id: number;
  streamId: number;
  name: string;
  mode: FilterModeValue;
  payload: unknown;
}

/**
 * Filter name constants
 */
export const FilterName = {
  COUNTRY: 'country',
  REGION: 'region',
  CITY: 'city',
  IP: 'ip',
  KEYWORD: 'keyword',
  USER_AGENT: 'user_agent',
  DEVICE: 'device_type',
  OS: 'os',
  BROWSER: 'browser',
  LANGUAGE: 'language',
  REFERER: 'referer',
  SCHEDULE: 'schedule',
  LIMIT: 'limit',
  ISP: 'isp',
  CONNECTION_TYPE: 'connection_type'
} as const;

export type FilterNameValue = typeof FilterName[keyof typeof FilterName];

export class StreamFilter extends AbstractModel {
  protected static _tableName = 'stream_filters';
  protected static _cacheKey = 'STREAM_FILTERS';
  protected static _entityName = 'stream_filter';

  getStreamId(): number {
    return this.get<number>('stream_id') ?? 0;
  }

  getName(): FilterNameValue {
    return (this.get<string>('name') ?? FilterName.IP) as FilterNameValue;
  }

  getMode(): FilterModeValue {
    return (this.get<string>('mode') ?? FilterMode.ACCEPT) as FilterModeValue;
  }

  getPayload(): unknown {
    const payload = this.get<string>('payload');
    if (!payload) return null;
    
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }

  isAcceptMode(): boolean {
    return this.getMode() === FilterMode.ACCEPT;
  }

  isRejectMode(): boolean {
    return this.getMode() === FilterMode.REJECT;
  }

  /**
   * Check if this filter matches the given context
   */
  matches(context: Record<string, unknown>): boolean {
    const name = this.getName();
    const payload = this.getPayload();
    
    // Get the value to check from context
    const contextValue = context[name];
    
    if (contextValue === undefined) {
      return false;
    }

    // Payload is an array of values to match against
    if (Array.isArray(payload)) {
      const matchFound = payload.some(item => {
        if (typeof item === 'string') {
          return String(contextValue).toLowerCase() === item.toLowerCase();
        }
        return contextValue === item;
      });
      return matchFound;
    }

    // Single value match
    if (typeof payload === 'string') {
      return String(contextValue).toLowerCase() === payload.toLowerCase();
    }

    return contextValue === payload;
  }
}
