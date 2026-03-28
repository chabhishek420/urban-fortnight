"use strict";
/**
 * Store Raw Clicks Stage
 *
 * Persists click data to the database.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/StoreRawClicksStage.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRawClicksStage = void 0;
const cached_settings_repository_1 = require("../../repository/cached-settings-repository");
const click_repository_1 = require("../../repository/click-repository");
class StoreRawClicksStage {
    /**
     * Process the pipeline payload
     */
    async process(payload, logEntry) {
        const clicks = payload.getRawClicksToStore();
        logEntry.add(`Saving clicks: ${clicks.length}`);
        // Check if stream collects clicks
        const stream = payload.getStream();
        if (stream && !stream.get('collect_clicks')) {
            logEntry.add('Stream doesn\'t store clicks. Skipping.');
            return payload;
        }
        // Check if stats are disabled
        const settingsRepo = cached_settings_repository_1.CachedSettingsRepository.getInstance();
        const disableStats = await settingsRepo.get('disable_stats');
        if (disableStats === '1') {
            logEntry.add('Statistics disabled. Skipping.');
            return payload;
        }
        // Get click repository
        const clickRepo = click_repository_1.ClickRepository.getInstance();
        // Store each click
        try {
            if (clicks.length === 1) {
                // Single click - use create
                const rawClick = clicks[0];
                if (rawClick) {
                    await clickRepo.create(rawClick);
                    logEntry.add('Click saved successfully');
                }
            }
            else if (clicks.length > 1) {
                // Multiple clicks - use createMany
                await clickRepo.createMany(clicks);
                logEntry.add(`${clicks.length} clicks saved successfully`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logEntry.add(`Error saving clicks: ${errorMessage}`);
        }
        return payload;
    }
}
exports.StoreRawClicksStage = StoreRawClicksStage;
//# sourceMappingURL=store-raw-clicks-stage.js.map