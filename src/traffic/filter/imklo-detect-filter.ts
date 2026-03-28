/**
 * ImkloDetect Filter
 * 
 * Anti-fraud/cloaking filter that integrates with IMKLO service.
 * Checks visitor against external IP/visitor analysis service.
 * 
 * @see keitaro_source/application/Component/StreamFilters/Filter/ImkloDetect.php
 */
import { AbstractFilter, FilterGroup, FilterGroupValue } from './filter-interface';
import type { StreamFilter } from '../model/stream-filter';
import type { RawClick } from '../model/raw-click';

/**
 * ImkloDetect modes
 */
export const ImkloMode = {
  BLACK: 'black',
  WHITE: 'white'
} as const;

export type ImkloModeValue = typeof ImkloMode[keyof typeof ImkloMode];

/**
 * ImkloDetect service interface
 */
export interface ImkloDetectService {
  /**
   * Check if visitor is "white" (safe/legitimate)
   * @returns true if visitor is safe, false if suspicious
   */
  checkVisitor(params: ImkloCheckParams): Promise<boolean>;
}

/**
 * Parameters sent to IMKLO service
 */
export interface ImkloCheckParams {
  ip: string;
  domain: string;
  referer: string;
  user_agent: string;
  url: string;
  headers: string;
  get: string;
}

/**
 * Global ImkloDetect service instance
 */
let imkloDetectService: ImkloDetectService | null = null;

/**
 * Set the ImkloDetect service instance
 */
export function setImkloDetectService(service: ImkloDetectService): void {
  imkloDetectService = service;
}

/**
 * Get the ImkloDetect service instance
 */
export function getImkloDetectService(): ImkloDetectService | null {
  return imkloDetectService;
}

/**
 * ImkloDetect Filter
 * 
 * Integrates with IMKLO anti-fraud service to detect suspicious traffic.
 * 
 * Modes:
 * - BLACK: Block suspicious traffic (pass when NOT white)
 * - WHITE: Allow only legitimate traffic (pass when white)
 */
export class ImkloDetectFilter extends AbstractFilter {
  getKey(): string {
    return 'imklo_detect';
  }

  getGroup(): FilterGroupValue {
    return FilterGroup.GEO;
  }

  getTooltip(): string {
    return 'Anti-fraud detection via IMKLO service';
  }

  /**
   * Get available modes
   */
  getModes(): { [key: string]: string } {
    return {
      [ImkloMode.BLACK]: 'Black (Block suspicious)',
      [ImkloMode.WHITE]: 'White (Allow only legitimate)'
    };
  }

  async isPassAsync(filter: StreamFilter, rawClick: RawClick): Promise<boolean> {
    const service = getImkloDetectService();
    
    if (!service) {
      this.log('ImkloDetectService not configured, allowing click');
      return true;
    }

    if (!this._serverRequest) {
      this.log('ServerRequest not set, allowing click');
      return true;
    }

    const mode = filter.getMode() as ImkloModeValue;
    const params = this.prepareParams(rawClick);

    try {
      const isWhite = await service.checkVisitor(params);
      
      this.log(`IMKLO check result: ${isWhite ? 'white' : 'black'}`);

      // PHP: return $filter->getMode() == BLACK && !$white || $filter->getMode() == WHITE && $white;
      if (mode === ImkloMode.BLACK) {
        // Black mode: pass when NOT white (block suspicious)
        return !isWhite;
      } else {
        // White mode: pass when white (allow only legitimate)
        return isWhite;
      }
    } catch (error) {
      this.log(`IMKLO error: ${error}`);
      // PHP: On error, return true (allow)
      return true;
    }
  }

  isPass(_filter: StreamFilter, _rawClick: RawClick): boolean {
    // Synchronous wrapper - for this filter, async is preferred
    // This returns true (allow) if service not available or can't check synchronously
    const service = getImkloDetectService();
    if (!service || !this._serverRequest) {
      return true;
    }
    
    // Note: For proper async operation, use isPassAsync()
    // This synchronous version will always allow if we can't check
    this.log('Warning: isPass called on async filter, use isPassAsync for proper operation');
    return true;
  }

  /**
   * Prepare parameters for IMKLO API
   */
  private prepareParams(rawClick: RawClick): ImkloCheckParams {
    const request = this._serverRequest;
    
    // Get domain
    let domain = '';
    if (request?.getParam?.('original_host')) {
      domain = request.getParam('original_host') as string;
    } else if (request?.getHeader?.('host')) {
      domain = request.getHeader('host') as string;
    }

    // Get referer
    const referer = request?.getHeader?.('referer') as string || '';

    // Get URL
    let url = '';
    if (request?.hasParam?.('kversion') && request?.hasParam?.('uri')) {
      try {
        const uri = request.getParam('uri') as string;
        const parsed = new URL(uri, `http://${domain}`);
        url = parsed.pathname;
      } catch {
        url = request?.getParam?.('uri') as string || '';
      }
    } else {
      url = request?.getUri?.()?.pathname || '';
    }

    // Get query params
    let getParams = '{}';
    if (request?.hasParam?.('kversion') && request?.hasParam?.('uri')) {
      try {
        const uri = request.getParam('uri') as string;
        const parsed = new URL(uri, `http://${domain}`);
        const queryObj: Record<string, string> = {};
        parsed.searchParams.forEach((value, key) => {
          queryObj[key] = value;
        });
        getParams = JSON.stringify(queryObj);
      } catch {
        getParams = JSON.stringify(request?.getQueryParams?.() || {});
      }
    } else {
      getParams = JSON.stringify(request?.getQueryParams?.() || {});
    }

    // Get headers
    let headers: Record<string, string> = {};
    if (request?.getParam?.('original_headers')) {
      const headersStr = request.getParam('original_headers');
      if (typeof headersStr === 'string') {
        try {
          headers = JSON.parse(headersStr) as Record<string, string>;
        } catch {
          headers = {};
        }
      }
    } else if (request?.getHeaders) {
      headers = request.getHeaders() as Record<string, string>;
    }

    return {
      ip: rawClick.getIp() || '',
      domain,
      referer,
      user_agent: rawClick.getUserAgent?.() || '',
      url,
      headers: JSON.stringify(headers),
      get: getParams
    };
  }
}

/**
 * Default HTTP-based ImkloDetect service implementation
 */
export class HttpImkloDetectService implements ImkloDetectService {
  private apiUrl: string;
  private timeout: number;

  constructor(apiUrl: string, timeout: number = 5000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }

  async checkVisitor(params: ImkloCheckParams): Promise<boolean> {
    let url = this.apiUrl;
    
    // Normalize URL
    if (!url.includes('http')) {
      url = `http://${url}`;
    }
    if (!url.includes('/api')) {
      url = `${url}/api`;
    }
    if (!url.includes('check_ip')) {
      url = `${url}/check_ip`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params as unknown as Record<string, string>).toString(),
        signal: AbortSignal.timeout(this.timeout)
      });

      const text = await response.text();
      
      // Remove BOM if present
      let content = text;
      if (text.charCodeAt(0) === 0xFEFF) {
        content = text.slice(1);
      }

      const json = JSON.parse(content);

      // Check for errors
      if (json.errors && json.errors.length > 0) {
        console.warn('IMKLO errors:', json.errors);
      }

      // PHP: return !$json || !empty($json->white_link) || $json->result == 0;
      // Returns true (white/safe) if:
      // - No JSON response
      // - Has white_link (already on whitelist)
      // - result is 0 (safe)
      return !json || !!json.white_link || json.result === 0;
    } catch (error) {
      console.error('IMKLO DETECT ERROR:', error);
      // On error, return true (allow visitor)
      return true;
    }
  }
}
