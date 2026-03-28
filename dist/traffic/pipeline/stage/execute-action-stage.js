"use strict";
/**
 * Execute Action Stage
 *
 * Executes the selected action (redirect, iframe, HTML, etc.)
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ExecuteActionStage.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteActionStage = void 0;
const stage_interface_1 = require("../../../core/pipeline/stage-interface");
const action_factory_1 = require("../../actions/action-factory");
class ExecuteActionStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
        const stream = payload.getStream();
        const rawClick = payload.getRawClick();
        const actionType = payload.getActionType();
        // Validate required data
        if (!rawClick) {
            throw new stage_interface_1.StageException('Empty rawClick');
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
            throw new stage_interface_1.StageException('Empty response in payload');
        }
        logEntry.add(`Executing action "${actionType}"`);
        try {
            // Create the action instance
            const action = (0, action_factory_1.createAction)(actionType);
            if (!action) {
                const streamId = stream?.getId() ?? 'unknown';
                throw new stage_interface_1.StageException(`Incorrect type "${actionType}" in stream #${streamId}`);
            }
            // Set payload and execute
            action.setPayload(payload);
            const updatedPayload = action.run();
            return updatedPayload;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new stage_interface_1.StageException(`Action error: ${errorMessage}`);
        }
    }
}
exports.ExecuteActionStage = ExecuteActionStage;
//# sourceMappingURL=execute-action-stage.js.map