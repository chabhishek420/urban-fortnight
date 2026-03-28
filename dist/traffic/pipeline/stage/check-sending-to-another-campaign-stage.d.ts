/**
 * Check Sending To Another Campaign Stage
 *
 * Handles campaign chaining (redirecting to another campaign).
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckSendingToAnotherCampaign.php
 */
import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface } from '../../../core/pipeline/stage-interface';
export declare class CheckSendingToAnotherCampaignStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
}
//# sourceMappingURL=check-sending-to-another-campaign-stage.d.ts.map