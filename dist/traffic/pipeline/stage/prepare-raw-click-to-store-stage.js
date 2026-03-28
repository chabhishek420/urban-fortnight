"use strict";
/**
 * Prepare Raw Click To Store Stage
 *
 * Prepares raw click data before persistence.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/PrepareRawClickToStoreStage.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrepareRawClickToStoreStage = void 0;
class PrepareRawClickToStoreStage {
    /**
     * Process the pipeline payload
     */
    process(payload, logEntry) {
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
exports.PrepareRawClickToStoreStage = PrepareRawClickToStoreStage;
//# sourceMappingURL=prepare-raw-click-to-store-stage.js.map