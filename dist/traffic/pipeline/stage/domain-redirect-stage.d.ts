/**
 * Domain Redirect Stage
 *
 * Handles domain-level redirects (SSL redirects).
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/DomainRedirectStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
/**
 * Domain redirect stage - handles SSL redirects
 */
export declare class DomainRedirectStage implements StageInterface {
    /**
     * Process the pipeline payload
     */
    process(payload: Payload, _logEntry: TrafficLogEntry): Payload;
    /**
     * Check if host is an IP address
     */
    private _isIpAddress;
    /**
     * Check CloudFlare scheme header
     */
    private _checkCloudFlareScheme;
    /**
     * Find domain redirect setting
     * @artifact ARTIFACT-005: Simplified implementation without domain repository
     */
    private _findDomainRedirect;
}
//# sourceMappingURL=domain-redirect-stage.d.ts.map