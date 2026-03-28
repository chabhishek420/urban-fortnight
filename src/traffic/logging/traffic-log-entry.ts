/**
 * Traffic Log Entry
 * 
 * Stores log information during traffic processing.
 * Used for debugging and auditing traffic flow.
 * 
 * @see keitaro_source/application/Traffic/Logging/TrafficLogEntry.php
 */
export class TrafficLogEntry {
  private _messages: string[] = [];
  private _startTime: number = Date.now();
  private _rawClick: unknown = null;

  /**
   * Add a log message
   */
  add(message: string): void {
    this._messages.push(message);
  }

  /**
   * Log raw click data
   */
  logRawClick(rawClick: unknown, _request: unknown): void {
    this._rawClick = rawClick;
    // In real implementation, would log click details
  }

  /**
   * Start profiling
   */
  startProfiling(): void {
    this._startTime = Date.now();
  }

  /**
   * Stop profiling and log elapsed time
   */
  stopProfiling(label: string = 'Execution time'): number {
    const elapsed = Date.now() - this._startTime;
    this.add(`${label}: ${elapsed}ms`);
    return elapsed;
  }

  /**
   * Get all messages
   */
  getMessages(): string[] {
    return [...this._messages];
  }

  /**
   * Get raw click data
   */
  getRawClick(): unknown {
    return this._rawClick;
  }

  /**
   * Convert to string for logging
   */
  toString(): string {
    return this._messages.join('\n');
  }

  /**
   * Check if there are any messages
   */
  hasMessages(): boolean {
    return this._messages.length > 0;
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this._messages = [];
    this._rawClick = null;
  }
}
