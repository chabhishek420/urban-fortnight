/**
 * Check Param Aliases Stage
 *
 * Checks and applies parameter aliases from settings and campaign configuration.
 * This stage runs early but handles the case when campaign is not yet set.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckParamAliasesStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Check Param Aliases Stage
 */
export declare class CheckParamAliasesStage implements StageInterface {
    private _paramsWithAliases;
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Payload;
    /**
     * Check aliases from settings
     */
    private _checkAliasesFromSettings;
    /**
     * Check aliases from campaign parameters
     */
    private _checkAliasesFromCampaign;
    /**
     * Check site alias
     */
    private _checkSiteAlias;
    /**
     * Check placeholders from campaign parameters
     */
    private _checkPlaceholderFromCampaign;
    /**
     * Get aliases for a parameter
     */
    private _getAliasesFor;
    /**
     * Check if value is a macro placeholder
     */
    private _isMacro;
}
//# sourceMappingURL=check-param-aliases-stage.d.ts.map