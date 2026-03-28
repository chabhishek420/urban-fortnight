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
export declare class PrepareRawClickToStoreStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
}
//# sourceMappingURL=prepare-raw-click-to-store-stage.d.ts.map