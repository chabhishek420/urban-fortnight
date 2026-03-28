/**
 * Device Filters
 * 
 * Filters clicks based on device characteristics.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Device Type Filter
 */
export class DeviceTypeFilter extends AbstractFilter {
  getKey(): string {
    return 'device_type';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const deviceType = rawClick.getDeviceType()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      deviceType === value.toLowerCase()
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * OS Filter
 */
export class OsFilter extends AbstractFilter {
  getKey(): string {
    return 'os';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const os = rawClick.getOs()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      os.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Browser Filter
 */
export class BrowserFilter extends AbstractFilter {
  getKey(): string {
    return 'browser';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const browser = rawClick.getBrowser()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      browser.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Browser Version Filter
 */
export class BrowserVersionFilter extends AbstractFilter {
  getKey(): string {
    return 'browser_version';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const browserVersion = rawClick.getBrowserVersion() ?? '';
    const payload = filter.getPayload() as Record<string, string> | null;
    
    if (!payload || !browserVersion) {
      return true;
    }

    const version = parseFloat(browserVersion);
    const minVersion = payload.min ? parseFloat(payload.min) : null;
    const maxVersion = payload.max ? parseFloat(payload.max) : null;

    if (minVersion !== null && version < minVersion) {
      return filter.getMode() === FilterMode.REJECT;
    }
    
    if (maxVersion !== null && version > maxVersion) {
      return filter.getMode() === FilterMode.REJECT;
    }

    return filter.getMode() === FilterMode.ACCEPT;
  }
}

/**
 * Language Filter
 */
export class LanguageFilter extends AbstractFilter {
  getKey(): string {
    return 'language';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const language = rawClick.getLanguage()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      language.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * Connection Type Filter
 */
export class ConnectionTypeFilter extends AbstractFilter {
  getKey(): string {
    return 'connection_type';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const connectionType = rawClick.getConnectionType()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      connectionType === value.toLowerCase()
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}

/**
 * ISP Filter
 */
export class IspFilter extends AbstractFilter {
  getKey(): string {
    return 'isp';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const isp = rawClick.getIsp()?.toLowerCase() ?? '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload)) {
      return true;
    }

    const found = payload.some(value => 
      isp.includes(value.toLowerCase())
    );

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }
}
