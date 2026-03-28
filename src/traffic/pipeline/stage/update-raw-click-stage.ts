/**
 * Update Raw Click Stage
 *
 * Updates raw click with campaign data after campaign is found.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateRawClickStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Update Raw Click Stage
 */
export class UpdateRawClickStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const rawClick = payload.getRawClick();
    const campaign = payload.getCampaign();

    if (!rawClick) {
      throw new StageException('rawClick is not set', 'UpdateRawClickStage');
    }

    if (!campaign) {
      throw new StageException('campaign is not set', 'UpdateRawClickStage');
    }

    // Set campaign ID
    rawClick.setCampaignId(campaign.getId()!);

    // Set traffic source ID
    const trafficSourceId = campaign.getTrafficSourceId();
    if (trafficSourceId) {
      rawClick.set('ts_id', trafficSourceId);
    }

    // Generate visitor code
    const visitorCode = this._generateVisitorCode(rawClick);
    rawClick.set('visitor_code', visitorCode);

    // Generate sub ID
    const subId = this._generateSubId(visitorCode);
    rawClick.setSubId(subId);

    payload.setRawClick(rawClick);
    return payload;
  }

  /**
   * Generate visitor code
   */
  private _generateVisitorCode(click: { getIp: () => string; getUserAgent: () => string }): string {
    // Simple hash of IP + UserAgent for visitor identification
    const ip = click.getIp();
    const ua = click.getUserAgent();
    const hash = this._simpleHash(`${ip}:${ua}`);
    return hash.toString(36);
  }

  /**
   * Generate sub ID from visitor code
   */
  private _generateSubId(visitorCode: string): string {
    const timestamp = Date.now().toString(36);
    return `${visitorCode}${timestamp}`.substring(0, 16);
  }

  /**
   * Simple hash function
   */
  private _simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
