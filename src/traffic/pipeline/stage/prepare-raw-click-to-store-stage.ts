/**
 * Prepare Raw Click To Store Stage
 * 
 * Prepares raw click data before persistence.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Stage/PrepareRawClickToStoreStage.php
 */

import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface } from '../../../core/pipeline/stage-interface';

export class PrepareRawClickToStoreStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const rawClick = payload.getRawClick();
    
    if (!rawClick) {
      logEntry.add('No raw click to prepare');
      return payload;
    }
    
    // Add click to the store queue
    payload.addRawClickToStore(rawClick);
    
    logEntry.add('Prepared raw click for storage');
    
    return payload;
  }
}
