/**
 * Choose Stream Stage
 *
 * Selects a stream from the campaign based on rotation rules.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/ChooseStreamStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Choose Stream Stage
 */
export declare class ChooseStreamStage implements StageInterface {
    static readonly NO_STREAM_SELECTED = "No stream selected";
    static readonly SHOW_TEXT = "show_text";
    static readonly DO_NOTHING = "do_nothing";
    private _streamRepository;
    constructor();
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, logEntry: TrafficLogEntry): Promise<Payload>;
    /**
     * Set no direction action
     */
    private _setNoDirection;
    /**
     * Trigger 404 not found
     */
    private _triggerNotFound;
    /**
     * Choose stream by position
     */
    private _chooseByPosition;
    /**
     * Choose stream by weight
     */
    private _chooseByWeight;
    /**
     * Find stream by ID
     */
    private _findStreamById;
    /**
     * Get active streams for campaign
     */
    private _getActiveStreams;
}
//# sourceMappingURL=choose-stream-stage.d.ts.map