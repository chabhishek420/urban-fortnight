/**
 * Execute Action Stage
 *
 * Executes the selected action (redirect, iframe, HTML, etc.)
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ExecuteActionStage.php
 */
import type { Payload } from '../payload';
import type { TrafficLogEntry } from '../../logging/traffic-log-entry';
import { StageInterface } from '../../../core/pipeline/stage-interface';
export declare class ExecuteActionStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
}
//# sourceMappingURL=execute-action-stage.d.ts.map