/**
 * Execute Action Stage
 * 
 * Executes the selected action (redirect, iframe, HTML, etc.)
 * 
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ExecuteActionStage.php
 */

import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface, StageException } from '../../../core/pipeline/stage-interface';
import { createAction, ActionTypeValue } from '../../actions/action-factory';

export class ExecuteActionStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const stream = payload.getStream();
    const rawClick = payload.getRawClick();
    const actionType = payload.getActionType() as ActionTypeValue;

    // Validate required data
    if (!rawClick) {
      throw new StageException('Empty rawClick');
    }

    if (!actionType) {
      let msg = 'Empty actionType in campaign #';
      const campaign = payload.getCampaign();
      if (campaign) {
        msg += campaign.getId();
      }
      logEntry.add(msg);
      return payload;
    }

    const response = payload.getResponse();
    if (!response) {
      throw new StageException('Empty response in payload');
    }

    logEntry.add(`Executing action "${actionType}"`);

    try {
      // Create the action instance
      const action = createAction(actionType);
      
      if (!action) {
        const streamId = stream?.getId() ?? 'unknown';
        throw new StageException(`Incorrect type "${actionType}" in stream #${streamId}`);
      }

      // Set payload and execute
      action.setPayload(payload);
      const updatedPayload = action.run();
      
      return updatedPayload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new StageException(`Action error: ${errorMessage}`);
    }
  }
}
