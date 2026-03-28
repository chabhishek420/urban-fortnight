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
export declare class StoreRawClicksStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload>;
}
//# sourceMappingURL=store-raw-clicks-stage.d.ts.map