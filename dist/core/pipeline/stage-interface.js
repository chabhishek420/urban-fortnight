"use strict";
/**
 * Pipeline Stage Interface
 *
 * Stages are the building blocks of the traffic processing pipeline.
 * Each stage processes the payload and passes it to the next stage.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/StageInterface.php
 * @artifact ARTIFACT-003: Original declared as 'final class', corrected to interface
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendToCampaignException = exports.CampaignNotFoundException = exports.StageException = exports.AbstractStage = void 0;
/**
 * Base stage implementation with common functionality
 */
class AbstractStage {
    /**
     * Stage name for logging
     */
    get name() {
        return this.constructor.name;
    }
    /**
     * Log a message to the traffic log
     */
    log(logEntry, message) {
        logEntry.add(`[${this.name}] ${message}`);
    }
}
exports.AbstractStage = AbstractStage;
/**
 * Exception thrown during stage processing
 */
class StageException extends Error {
    stageName;
    constructor(message, stageName) {
        super(message);
        this.stageName = stageName;
        this.name = 'StageException';
    }
}
exports.StageException = StageException;
/**
 * Exception thrown when campaign is not found
 */
class CampaignNotFoundException extends StageException {
    constructor(message = 'Campaign not found') {
        super(message, 'FindCampaignStage');
        this.name = 'CampaignNotFoundException';
    }
}
exports.CampaignNotFoundException = CampaignNotFoundException;
/**
 * Exception thrown when sending to another campaign
 */
class SendToCampaignException extends StageException {
    campaignId;
    constructor(campaignId, message = `Redirecting to campaign ${campaignId}`) {
        super(message, 'CheckSendingToAnotherCampaign');
        this.campaignId = campaignId;
        this.name = 'SendToCampaignException';
    }
}
exports.SendToCampaignException = SendToCampaignException;
//# sourceMappingURL=stage-interface.js.map