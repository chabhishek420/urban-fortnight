/**
 * Gateway Redirect Dispatcher
 * 
 * Handles gateway redirects for secure landing page redirects.
 * Decodes JWT tokens and returns redirect pages.
 * 
 * @see keitaro_source/application/Traffic/Dispatcher/GatewayRedirectDispatcher.php
 */
import type { DispatcherInterface } from '../../core/dispatcher/dispatcher-interface';
import type { ServerRequest } from '../request/server-request';
import type { Response } from '../response/response';
import { Response as HttpResponse } from '../response/response';
import { StatusCode } from '../response/status-code';

export class GatewayRedirectDispatcher implements DispatcherInterface {
  /**
   * Dispatch the gateway redirect request
   */
  dispatch(request: ServerRequest): Response {
    const response = new HttpResponse({
      disableCache: true
    });
    
    const token = request.getParam('token');
    const userAgent = request.getUserAgent();
    
    try {
      // Decode JWT token
      const decoded = this.decodeToken(token ?? '', userAgent);
      
      if (!decoded || !decoded.url) {
        return this.badRequest();
      }
      
      // Generate redirect HTML
      const code = this.generateRedirectCode(decoded.url);
      return response.withBody(code);
      
    } catch (e) {
      return this.badRequest();
    }
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string, _userAgent: string): { url: string } | null {
    // In production: Use JWT library to decode
    // const key = LpTokenService::generateUserKey(userAgent);
    // return JWT.decode(token, key, ['HS256']);
    
    // Simplified implementation
    try {
      if (!token) return null;
      
      // Basic JWT decode (not production-ready)
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64').toString());
      return payload as { url: string };
    } catch {
      return null;
    }
  }

  /**
   * Generate redirect HTML code
   */
  private generateRedirectCode(url: string): string {
    return `<html>
      <head>
        <meta http-equiv="REFRESH" content="1; URL='${url}'">
        <script type="application/javascript">window.location = "${url}";</script>
      </head>
    </html>`;
  }

  /**
   * Return bad request response
   */
  private badRequest(): Response {
    return new HttpResponse({
      status: StatusCode.BAD_REQUEST,
      body: 'Bad Request'
    });
  }
}
