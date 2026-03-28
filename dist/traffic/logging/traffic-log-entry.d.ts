/**
 * Traffic Log Entry
 *
 * Stores log information during traffic processing.
 * Used for debugging and auditing traffic flow.
 *
 * @see keitaro_source/application/Traffic/Logging/TrafficLogEntry.php
 */
export declare class TrafficLogEntry {
    private _messages;
    private _startTime;
    private _rawClick;
    /**
     * Add a log message
     */
    add(message: string): void;
    /**
     * Log raw click data
     */
    logRawClick(rawClick: unknown, _request: unknown): void;
    /**
     * Start profiling
     */
    startProfiling(): void;
    /**
     * Stop profiling and log elapsed time
     */
    stopProfiling(label?: string): number;
    /**
     * Get all messages
     */
    getMessages(): string[];
    /**
     * Get raw click data
     */
    getRawClick(): unknown;
    /**
     * Convert to string for logging
     */
    toString(): string;
    /**
     * Check if there are any messages
     */
    hasMessages(): boolean;
    /**
     * Clear all messages
     */
    clear(): void;
}
//# sourceMappingURL=traffic-log-entry.d.ts.map