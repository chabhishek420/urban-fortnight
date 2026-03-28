/**
 * Bot Filter
 * 
 * Filters clicks based on bot detection.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/IsBot.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Is Bot Filter
 */
export class IsBotFilter extends AbstractFilter {
  getKey(): string {
    return 'is_bot';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Filter visitors identified as bots';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const isBot = rawClick.isBot();

    if (filter.getMode() === FilterMode.ACCEPT) {
      return isBot;
    } else {
      return !isBot;
    }
  }
}

/**
 * Proxy Filter
 * 
 * Filters clicks based on proxy detection.
 */
export class ProxyFilter extends AbstractFilter {
  getKey(): string {
    return 'is_using_proxy';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Filter visitors using proxy/VPN';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const isProxy = rawClick.isProxy();

    if (filter.getMode() === FilterMode.ACCEPT) {
      return isProxy;
    } else {
      return !isProxy;
    }
  }
}

/**
 * User Agent Filter
 * 
 * Filters clicks based on user agent string.
 */
export class UserAgentFilter extends AbstractFilter {
  getKey(): string {
    return 'user_agent';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const userAgent = rawClick.getUserAgent()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload) || !userAgent) {
      return true;
    }

    const found = payload.some(value => 
      userAgent.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Operator Filter
 * 
 * Filters clicks based on mobile carrier/operator.
 */
export class OperatorFilter extends AbstractFilter {
  getKey(): string {
    return 'operator';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const operator = rawClick.get<string>('operator')?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      operator.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}
