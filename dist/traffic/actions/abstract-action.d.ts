/**
 * Traffic Actions - Abstract Action Base Class
 *
 * Base class for all stream action implementations.
 * Actions determine how to respond to clicks (redirects, iframes, HTML, etc.)
 *
 * @see keitaro_source/application/Traffic/Actions/AbstractAction.php
 */
import type { Payload } from '../pipeline/payload';
import type { Response } from '../response/response';
import type { ServerRequest } from '../request/server-request';
import type { RawClick } from '../model/raw-click';
import type { Campaign } from '../model/campaign';
import type { BaseStream } from '../model/base-stream';
import type { Offer } from '../model/offer';
import type { Landing } from '../model/landing';
/**
 * Action field types
 */
export declare enum ActionField {
    URL = "url",
    TEXT = "text",
    CAMPAIGNS = "campaigns",
    STREAMS = "streams",
    NOTHING = "nothing",
    UPLOAD = "upload"
}
/**
 * Action type categories
 */
export declare enum ActionType {
    REDIRECT = "redirect",
    OTHER = "other",
    HIDDEN = "hidden"
}
/**
 * Action options interface
 */
export interface ActionOptions {
    headers?: Record<string, string>;
    status?: number;
    content?: string;
}
/**
 * Abstract Action Base Class
 */
export declare abstract class AbstractAction {
    protected _name: string;
    protected _weight: number;
    protected _payload: Payload | null;
    constructor(name: string);
    /**
     * Get action type (redirect, other, hidden)
     */
    getType(): ActionType;
    /**
     * Get field type for this action
     */
    getField(): ActionField;
    /**
     * Get action name
     */
    getName(): string;
    /**
     * Get action weight (for ordering)
     */
    getWeight(): number;
    /**
     * Set pipeline payload
     */
    setPayload(payload: Payload): void;
    /**
     * Get pipeline payload
     */
    getPayload(): Payload;
    /**
     * Get response from payload
     */
    getResponse(): Response;
    /**
     * Set response on payload
     */
    setResponse(response: Response): void;
    /**
     * Get raw click from payload
     */
    getRawClick(): RawClick;
    /**
     * Get campaign from payload
     */
    getCampaign(): Campaign | undefined;
    /**
     * Get stream from payload
     */
    getStream(): BaseStream | undefined;
    /**
     * Get landing from payload
     */
    getLanding(): Landing | undefined;
    /**
     * Get offer from payload
     */
    getOffer(): Offer | undefined;
    /**
     * Get server request from payload
     */
    getServerRequest(): ServerRequest;
    /**
     * Get raw action payload (before macro processing)
     */
    getRawActionPayload(): string;
    /**
     * Get action payload with macros processed
     */
    getActionPayload(): string;
    /**
     * Get action options
     */
    getActionOptions(): ActionOptions;
    /**
     * Execute the action - must be implemented by subclasses
     */
    abstract execute(): void;
    /**
     * Run the action and return modified payload
     */
    run(): Payload;
    /**
     * Set response status code
     */
    setStatus(status: number): void;
    /**
     * Set response header
     */
    setHeader(name: string, value: string): void;
    /**
     * Add header from string (e.g., "Content-Type: text/html")
     */
    addHeader(headerString: string): void;
    /**
     * Set response content type
     */
    setContentType(contentType: string): void;
    /**
     * Set response body content
     */
    setContent(content: string): void;
    /**
     * Set redirect location header
     */
    redirect(url: string): void;
    /**
     * Set destination info on click
     */
    setDestinationInfo(value: string): void;
    /**
     * Process macros in content
     */
    protected processMacros(content: string): string;
    /**
     * Execute in different contexts (default, script, frame)
     */
    protected executeInContext(): void;
    /**
     * Execute for script context
     */
    protected executeForScript(): void;
    /**
     * Execute for frame context
     */
    protected executeForFrame(): void;
    /**
     * Execute default - must be implemented by subclasses
     */
    protected executeDefault(): void;
}
//# sourceMappingURL=abstract-action.d.ts.map