/**
 * Pipeline Stage Factory
 *
 * Creates configured pipeline stages for click processing.
 *
 * @see keitaro_source/application/Traffic/Pipeline/FirstLevel/StageFactory.php
 */
import type { StageInterface } from '../../core/pipeline/stage-interface';
/**
 * Get the first level pipeline stages
 *
 * These stages are executed in order for each click request.
 * Order matters - stages depend on data from previous stages.
 */
export declare function getFirstLevelStages(): StageInterface[];
/**
 * Get second level pipeline stages
 *
 * These stages are used when forwarding to another campaign.
 * They skip initial click building steps.
 */
export declare function getSecondLevelStages(): StageInterface[];
//# sourceMappingURL=stages.d.ts.map