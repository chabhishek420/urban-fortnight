/**
 * Find Affiliate Network Stage
 *
 * Finds the affiliate network for the selected offer.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/FindAffiliateNetworkStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';

/**
 * Find Affiliate Network Stage
 */
export class FindAffiliateNetworkStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const offer = payload.getOffer();

    // Skip if no offer
    if (!offer) {
      return payload;
    }

    // Get affiliate network
    const affiliateNetworkId = offer.getAffiliateNetworkId();
    if (!affiliateNetworkId) {
      return payload;
    }

    const network = this._findAffiliateNetwork(affiliateNetworkId);
    if (!network) {
      return payload;
    }

    // Add offer parameter to URL
    const offerParam = network.get('offer_param') as string | undefined;
    if (offerParam) {
      const actionPayload = payload.getActionPayload() as string;
      if (typeof actionPayload === 'string') {
        const newPayload = this._addParameterToUrl(actionPayload, offerParam);
        payload.setActionPayload(newPayload);
      }
    }

    // Set affiliate network ID on click
    const rawClick = payload.getRawClick();
    if (rawClick) {
      rawClick.setAffiliateNetworkId(network.getId()!);
    }

    return payload;
  }

  /**
   * Add parameter to URL
   */
  private _addParameterToUrl(url: string, param: string): string {
    if (!url) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${param}`;
  }

  /**
   * Find affiliate network by ID
   * @artifact ARTIFACT-032: Placeholder - needs repository
   */
  private _findAffiliateNetwork(_id: number): AffiliateNetwork | null {
    // TODO: Implement affiliate network repository
    return null;
  }
}

/**
 * Affiliate Network model placeholder
 */
export interface AffiliateNetwork {
  getId(): number | undefined;
  get<T = unknown>(key: string): T | undefined;
}
