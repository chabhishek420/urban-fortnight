"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLogEntry = void 0;
/**
 * Traffic Log Entry
 *
 * Stores log information during traffic processing.
 * Used for debugging and auditing traffic flow.
 *
 * @see keitaro_source/application/Traffic/Logging/TrafficLogEntry.php
 */
class TrafficLogEntry {
    _messages = [];
    _startTime = Date.now();
    _rawClick = null;
    /**
     * Add a log message
     */
    add(message) {
        this._messages.push(message);
    }
    /**
     * Log raw click data
     */
    logRawClick(rawClick, _request) {
        this._rawClick = rawClick;
        // In real implementation, would log click details
    }
    /**
     * Start profiling
     */
    startProfiling() {
        this._startTime = Date.now();
    }
    /**
     * Stop profiling and log elapsed time
     */
    stopProfiling(label = 'Execution time') {
        const elapsed = Date.now() - this._startTime;
        this.add(`${label}: ${elapsed}ms`);
        return elapsed;
    }
    /**
     * Get all messages
     */
    getMessages() {
        return [...this._messages];
    }
    /**
     * Get raw click data
     */
    getRawClick() {
        return this._rawClick;
    }
    /**
     * Convert to string for logging
     */
    toString() {
        return this._messages.join('\n');
    }
    /**
     * Check if there are any messages
     */
    hasMessages() {
        return this._messages.length > 0;
    }
    /**
     * Clear all messages
     */
    clear() {
        this._messages = [];
        this._rawClick = null;
    }
}
exports.TrafficLogEntry = TrafficLogEntry;
//# sourceMappingURL=traffic-log-entry.js.map