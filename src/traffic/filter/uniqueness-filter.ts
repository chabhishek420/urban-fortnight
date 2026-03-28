/**
 * Uniqueness Filter
 * 
 * Filters clicks based on visitor uniqueness.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/Uniqueness.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';
import { FilterMode } from '../model/stream-filter';

/**
 * Uniqueness scope constants
 */
export const UniquenessScope = {
  STREAM: 'stream',
  GROUP: 'group',
  CAMPAIGN: 'campaign',
  GLOBAL: 'global'
} as const;

export type UniquenessScopeValue = typeof UniquenessScope[keyof typeof UniquenessScope];

/**
 * Uniqueness service interface (to be injected)
 */
export interface UniquenessService {
  isUniqueStream(request: unknown, rawClick: RawClick, campaignId: number, streamId: number): boolean;
  isUniqueForCampaign(request: unknown, rawClick: RawClick, campaignId: number): boolean;
  isUniqueGlobal(request: unknown, rawClick: RawClick): boolean;
}

/**
 * Global uniqueness service instance
 */
let uniquenessService: UniquenessService | null = null;

/**
 * Set the uniqueness service instance
 */
export function setUniquenessService(service: UniquenessService): void {
  uniquenessService = service;
}

/**
 * Get the uniqueness service instance
 */
export function getUniquenessService(): UniquenessService | null {
  return uniquenessService;
}

/**
 * Uniqueness Filter
 * 
 * Filters clicks based on whether the visitor is unique at different scopes:
 * - stream: Unique within the stream
 * - group: Unique within the group
 * - campaign: Unique within the campaign
 * - global: Unique across all campaigns
 */
export class UniquenessFilter extends AbstractFilter {
  getKey(): string {
    return 'uniqueness';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.DEVICE;
  }

  getTooltip(): string {
    return 'Filter by visitor uniqueness (stream, campaign, or global)';
  }

  /**
   * Get default scope
   */
  getDefaults(): UniquenessScopeValue {
    return UniquenessScope.STREAM;
  }

  isPass(filter: StreamFilter, rawClick: RawClick): boolean {
    const scope = (filter.getPayload() as UniquenessScopeValue) || this.getDefaults();
    const service = getUniquenessService();
    
    let isUnique = false;

    switch (scope) {
      case UniquenessScope.STREAM:
        isUnique = this.checkStreamUniqueness(filter, rawClick, service);
        break;
      
      case UniquenessScope.GROUP:
      case UniquenessScope.CAMPAIGN:
        isUnique = rawClick.isUniqueCampaign ? rawClick.isUniqueCampaign() : 
          this.checkCampaignUniqueness(filter, rawClick, service);
        break;
      
      case UniquenessScope.GLOBAL:
        isUnique = rawClick.isUniqueGlobal ? rawClick.isUniqueGlobal() :
          this.checkGlobalUniqueness(rawClick, service);
        break;
      
      default:
        // Unknown scope - match PHP behavior: return false in ACCEPT mode, true in REJECT mode
        // PHP: return $isUnique && $filter->getMode() == ACCEPT || !$isUnique && $filter->getMode() == REJECT;
        // With $isUnique = false (initial value): false && ACCEPT = false, or true && REJECT = true
        return filter.getMode() === FilterMode.REJECT;
    }

    return filter.getMode() === FilterMode.ACCEPT ? isUnique : !isUnique;
  }

  /**
   * Check stream-level uniqueness
   */
  private checkStreamUniqueness(
    filter: StreamFilter, 
    rawClick: RawClick,
    service: UniquenessService | null
  ): boolean {
    const streamId = filter.getStreamId();
    
    // First check if rawClick has direct method
    if (rawClick.isUniqueStream) {
      return rawClick.isUniqueStream();
    }
    
    // Use service if available
    if (service) {
      return service.isUniqueStream(this._serverRequest, rawClick, 0, streamId);
    }
    
    // Fallback to campaign uniqueness
    if (rawClick.isUniqueCampaign) {
      return rawClick.isUniqueCampaign();
    }
    
    return false;
  }

  /**
   * Check campaign-level uniqueness
   */
  private checkCampaignUniqueness(
    _filter: StreamFilter,
    rawClick: RawClick,
    _service: UniquenessService | null
  ): boolean {
    if (rawClick.isUniqueCampaign) {
      return rawClick.isUniqueCampaign();
    }
    return false;
  }

  /**
   * Check global uniqueness
   */
  private checkGlobalUniqueness(
    rawClick: RawClick,
    _service: UniquenessService | null
  ): boolean {
    if (rawClick.isUniqueGlobal) {
      return rawClick.isUniqueGlobal();
    }
    return false;
  }
}
