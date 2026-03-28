/**
 * Domain Redirect Stage
 *
 * Handles domain-level redirects (SSL redirects).
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/DomainRedirectStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { Response } from '../../response/response';
import { StatusCode } from '../../response/status-code';

/**
 * Domain redirect stage - handles SSL redirects
 */
export class DomainRedirectStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const request = payload.getServerRequest();

    // Check if request exists
    if (!request) {
      return payload;
    }

    // Check if host is an IP address - no redirect for IPs
    if (this._isIpAddress(request.getUri().host)) {
      return payload;
    }

    // Find domain redirect
    const redirect = this._findDomainRedirect(request);

    if (redirect && redirect !== request.getUri().protocol.replace(':', '')) {
      // Check CloudFlare scheme
      if (this._checkCloudFlareScheme(request)) {
        const path = request.getUri().toString().replace(
          request.getUri().protocol,
          `${redirect}:`
        );

        const response = payload.getResponse() ?? new Response();
        response.withStatus(StatusCode.MOVED_PERMANENTLY).withHeader('Location', path);

        payload.setResponse(response);
        payload.abort();
      }
    }

    return payload;
  }

  /**
   * Check if host is an IP address
   */
  private _isIpAddress(host: string): boolean {
    // IPv4 pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 pattern (simplified)
    const ipv6Pattern = /^\[?[0-9a-fA-F:]+\]?$/;

    return ipv4Pattern.test(host) || ipv6Pattern.test(host);
  }

  /**
   * Check CloudFlare scheme header
   */
  private _checkCloudFlareScheme(request: { getHeader: (name: string) => string | undefined }): boolean {
    const cfVisitorHeader = request.getHeader('CF-Visitor');
    if (cfVisitorHeader) {
      try {
        const scheme = JSON.parse(cfVisitorHeader);
        if (scheme.scheme === 'https') {
          return false;
        }
      } catch {
        // Invalid JSON, continue
      }
    }
    return true;
  }

  /**
   * Find domain redirect setting
   * @artifact ARTIFACT-005: Simplified implementation without domain repository
   */
  private _findDomainRedirect(_request: { getUri: () => URL }): string | null {
    // In original implementation, this would check CachedDomainRepository
    // For now, return null (no redirect)
    // TODO: Implement domain repository integration
    return null;
  }
}
