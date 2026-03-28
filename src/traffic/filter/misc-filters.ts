/**
 * Miscellaneous Filters
 * 
 * Additional filters for IPv6, device model, etc.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Ipv6.php
 * @see keitaro_source/application/Component/StreamFilters/Filter/DeviceModel.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * IPv6 Filter
 * 
 * Filters clicks based on IPv6 address.
 */
export class Ipv6Filter extends AbstractFilter {
  getKey(): string {
    return 'ipv6';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  getTooltip(): string {
    return 'Filter by IPv6 address or range';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const ip = rawClick.getIp();
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload) || !ip) {
      return true;
    }

    // Check if this is an IPv6 address
    const isIpv6 = this.isIpv6Address(ip);
    
    let found = false;
    for (const mask of payload) {
      if (this.checkIpv6(mask.trim(), ip)) {
        found = true;
        break;
      }
    }

    // For IPv6 filter, we check if it's IPv6 traffic
    // and if it matches the configured ranges
    if (filter.getMode() === FilterMode.ACCEPT) {
      return isIpv6 && found;
    } else {
      return !(isIpv6 && found);
    }
  }

  /**
   * Check if address is IPv6
   */
  private isIpv6Address(ip: string): boolean {
    // IPv6 addresses contain colons
    return ip.includes(':');
  }

  /**
   * Check IPv6 against mask
   */
  private checkIpv6(mask: string, ip: string): boolean {
    // CIDR notation (e.g., 2001:db8::/32)
    if (mask.includes('/')) {
      return this.ipv6InCIDR(ip, mask);
    }

    // Exact match
    return this.normalizeIpv6(ip) === this.normalizeIpv6(mask);
  }

  /**
   * Normalize IPv6 address for comparison
   */
  private normalizeIpv6(ip: string): string {
    try {
      // Expand :: notation
      if (ip.includes('::')) {
        const parts = ip.split('::');
        const left = parts[0]?.split(':').filter(Boolean) || [];
        const right = parts[1]?.split(':').filter(Boolean) || [];
        const missing = 8 - left.length - right.length;
        const expanded = [...left, ...Array(missing).fill('0'), ...right];
        return expanded.map(p => p.padStart(4, '0')).join(':');
      }

      // Just normalize each segment
      return ip.split(':').map(p => p.padStart(4, '0')).join(':');
    } catch {
      return ip.toLowerCase();
    }
  }

  /**
   * Check if IPv6 is in CIDR range
   */
  private ipv6InCIDR(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const maskBits = parseInt(bits ?? '128', 10);

    const normalizedIp = this.normalizeIpv6(ip);
    const normalizedRange = this.normalizeIpv6(range ?? '');

    // Simple comparison for full mask
    if (maskBits === 128) {
      return normalizedIp === normalizedRange;
    }

    // For partial masks, compare the relevant bits
    const ipParts = normalizedIp.split(':');
    const rangeParts = normalizedRange.split(':');

    // Convert to binary and compare
    const ipBinary = this.ipv6ToBinary(ipParts);
    const rangeBinary = this.ipv6ToBinary(rangeParts);

    if (!ipBinary || !rangeBinary) {
      return false;
    }

    return ipBinary.substring(0, maskBits) === rangeBinary.substring(0, maskBits);
  }

  /**
   * Convert IPv6 parts to binary string
   */
  private ipv6ToBinary(parts: string[]): string | null {
    try {
      return parts.map(p => {
        const num = parseInt(p, 16);
        return num.toString(2).padStart(16, '0');
      }).join('');
    } catch {
      return null;
    }
  }
}

/**
 * Device Model Filter
 * 
 * Filters clicks based on device model.
 */
export class DeviceModelFilter extends AbstractFilter {
  getKey(): string {
    return 'device_model';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Filter by device model (e.g., iPhone, Galaxy S)';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const deviceModel = rawClick.getDeviceModel?.() || '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload) || !deviceModel) {
      return true;
    }

    let found = false;
    for (const search of payload) {
      const tokens = search.split(/[,;]/).map(t => t.trim()).filter(Boolean);
      
      for (const token of tokens) {
        if (this.matchDeviceModel(token, deviceModel)) {
          found = true;
          break;
        }
      }
      
      if (found) break;
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }

  /**
   * Match device model with pattern
   */
  private matchDeviceModel(pattern: string, deviceModel: string): boolean {
    // Case-insensitive match
    const lowerPattern = pattern.toLowerCase();
    const lowerModel = deviceModel.toLowerCase();

    // Wildcard support
    if (lowerPattern.includes('*')) {
      const regex = new RegExp(`^${lowerPattern.replace(/\*/g, '.*')}$`);
      return regex.test(lowerModel);
    }

    // Contains match
    return lowerModel.includes(lowerPattern);
  }
}

/**
 * OS Version Filter
 * 
 * Filters clicks based on operating system version.
 */
export class OsVersionFilter extends AbstractFilter {
  getKey(): string {
    return 'os_version';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Filter by OS version (e.g., iOS 14, Android 11)';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const osVersion = rawClick.getOsVersion?.() || '';
    const payload = filter.getPayload() as string[] | null;
    
    if (!Array.isArray(payload) || !osVersion) {
      return true;
    }

    let found = false;
    for (const search of payload) {
      if (this.matchVersion(search.trim(), osVersion)) {
        found = true;
        break;
      }
    }

    return filter.getMode() === FilterMode.ACCEPT ? found : !found;
  }

  /**
   * Match version with pattern
   */
  private matchVersion(pattern: string, version: string): boolean {
    const lowerPattern = pattern.toLowerCase();
    const lowerVersion = version.toLowerCase();

    // Support comparison operators
    if (lowerPattern.startsWith('>=')) {
      return this.compareVersions(lowerVersion, lowerPattern.substring(2)) >= 0;
    }
    if (lowerPattern.startsWith('<=')) {
      return this.compareVersions(lowerVersion, lowerPattern.substring(2)) <= 0;
    }
    if (lowerPattern.startsWith('>')) {
      return this.compareVersions(lowerVersion, lowerPattern.substring(1)) > 0;
    }
    if (lowerPattern.startsWith('<')) {
      return this.compareVersions(lowerVersion, lowerPattern.substring(1)) < 0;
    }
    if (lowerPattern.startsWith('=')) {
      return this.compareVersions(lowerVersion, lowerPattern.substring(1)) === 0;
    }

    // Wildcard match (e.g., "14.*")
    if (lowerPattern.includes('*')) {
      const regex = new RegExp(`^${lowerPattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
      return regex.test(lowerVersion);
    }

    // Contains match
    return lowerVersion.includes(lowerPattern);
  }

  /**
   * Compare two version strings
   * Returns: -1 if a < b, 0 if equal, 1 if a > b
   */
  private compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    const maxLen = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < maxLen; i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;

      if (numA < numB) return -1;
      if (numA > numB) return 1;
    }

    return 0;
  }
}

/**
 * Hide Click Detect Filter
 * 
 * Detects hidden/invisible clicks.
 */
export class HideClickDetectFilter extends AbstractFilter {
  getKey(): string {
    return 'hide_click_detect';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Detect and filter hidden/invisible clicks';
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    // Check for various indicators of hidden clicks
    const isHidden = this.detectHiddenClick(rawClick);

    return filter.getMode() === FilterMode.ACCEPT ? !isHidden : isHidden;
  }

  /**
   * Detect if this is a hidden/invisible click
   */
  private detectHiddenClick(rawClick: RawClick): boolean {
    // Check for empty user agent
    const userAgent = rawClick.getUserAgent?.();
    if (!userAgent || userAgent.trim() === '') {
      return true;
    }

    // Check for suspiciously short sessions
    // This would require additional context from the request

    return false;
  }
}
