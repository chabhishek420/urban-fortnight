/**
 * Store Raw Clicks Stage
 * 
 * Persists click data to the database.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Stage/StoreRawClicksStage.php
 */

import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface } from '../../../core/pipeline/stage-interface';
import { CachedSettingsRepository } from '../../repository/cached-settings-repository';
import { ClickRepository } from '../../repository/click-repository';

export class StoreRawClicksStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  async process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload> {
    const clicks = payload.getRawClicksToStore();
    
    logEntry.add(`Saving clicks: ${clicks.length}`);
    
    // Check if stream collects clicks
    const stream = payload.getStream();
    if (stream && !stream.get('collect_clicks')) {
      logEntry.add('Stream doesn\'t store clicks. Skipping.');
      return payload;
    }
    
    // Check if stats are disabled
    const settingsRepo = CachedSettingsRepository.getInstance();
    const disableStats = await settingsRepo.get('disable_stats');
    if (disableStats === '1') {
      logEntry.add('Statistics disabled. Skipping.');
      return payload;
    }
    
    // Get click repository
    const clickRepo = ClickRepository.getInstance();
    
    // Store each click
    try {
      if (clicks.length === 1) {
        // Single click - use create
        const rawClick = clicks[0];
        if (rawClick) {
          await clickRepo.create(rawClick);
          logEntry.add('Click saved successfully');
        }
      } else if (clicks.length > 1) {
        // Multiple clicks - use createMany
        await clickRepo.createMany(clicks);
        logEntry.add(`${clicks.length} clicks saved successfully`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logEntry.add(`Error saving clicks: ${errorMessage}`);
    }
    
    return payload;
  }
}
