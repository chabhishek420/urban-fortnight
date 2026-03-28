"use strict";
/**
 * Click Dispatcher
 *
 * Main dispatcher for processing regular click traffic.
 * Runs the first level pipeline stages to process the click.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/ClickDispatcher.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const payload_js_1 = require("../pipeline/payload.js");
const pipeline_js_1 = require("../pipeline/pipeline.js");
const traffic_log_entry_js_1 = require("../logging/traffic-log-entry.js");
const raw_click_js_1 = require("../model/raw-click.js");
class ClickDispatcher {
    /**
     * Dispatch the click request through the pipeline
     */
    async dispatch(request) {
        const response = response_js_1.Response.buildHtml({
            disableCache: true
        });
        // Create log entry
        const logEntry = new traffic_log_entry_js_1.TrafficLogEntry();
        logEntry.add('ClickDispatcher: Starting dispatch');
        // Check license (in production)
        if (this.isLicenseExpired()) {
            return this.getErrorResponse('License expired', status_code_js_1.StatusCode.PAYMENT_REQUIRED);
        }
        try {
            // Create pipeline payload
            const pipelinePayload = new payload_js_1.Payload({
                serverRequest: request,
                response,
                rawClick: new raw_click_js_1.RawClick()
            });
            pipelinePayload.setForceRedirectOffer(true);
            // Create and configure pipeline
            const pipeline = new pipeline_js_1.Pipeline();
            pipeline.firstLevelStages();
            logEntry.add(`Pipeline stages: ${pipeline.getStages().length}`);
            // Run the pipeline
            const result = await pipeline.process(pipelinePayload, logEntry);
            // Get the final response
            const finalResponse = result.getResponse();
            logEntry.add('ClickDispatcher: Pipeline completed');
            // Log the entry (in production, this would go to a log file)
            console.log(logEntry.toString());
            return finalResponse || response;
        }
        catch (e) {
            const error = e;
            logEntry.add(`Error: ${error.message}`);
            console.error('ClickDispatcher error:', error);
            console.log(logEntry.toString());
            return this.getErrorResponse(error.message);
        }
    }
    /**
     * Process context through the pipeline (for DispatcherInterface)
     */
    process(context) {
        // This is a simplified sync version for compatibility
        // In production, use dispatch() which is async
        return context;
    }
    /**
     * Check if license is expired
     */
    isLicenseExpired() {
        // In production: Check TsService for license status
        return false;
    }
    /**
     * Get error response
     */
    getErrorResponse(_message, status = status_code_js_1.StatusCode.NOT_IMPLEMENTED) {
        // In production: Hide error message if not in debug mode
        const errorMessage = 'Sorry. Some internal problems. Please read System Log.';
        return response_js_1.Response.buildHtml({
            body: errorMessage,
            status
        });
    }
}
exports.ClickDispatcher = ClickDispatcher;
//# sourceMappingURL=click-dispatcher.js.map