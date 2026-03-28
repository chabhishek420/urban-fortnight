"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayRedirectDispatcher = void 0;
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
class GatewayRedirectDispatcher {
    /**
     * Dispatch the gateway redirect request
     */
    dispatch(request) {
        const response = new response_js_1.Response({
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
        }
        catch (e) {
            return this.badRequest();
        }
    }
    /**
     * Decode JWT token
     */
    decodeToken(token, _userAgent) {
        // In production: Use JWT library to decode
        // const key = LpTokenService::generateUserKey(userAgent);
        // return JWT.decode(token, key, ['HS256']);
        // Simplified implementation
        try {
            if (!token)
                return null;
            // Basic JWT decode (not production-ready)
            const parts = token.split('.');
            if (parts.length !== 3)
                return null;
            const payload = JSON.parse(Buffer.from(parts[1] ?? '', 'base64').toString());
            return payload;
        }
        catch {
            return null;
        }
    }
    /**
     * Generate redirect HTML code
     */
    generateRedirectCode(url) {
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
    badRequest() {
        return new response_js_1.Response({
            status: status_code_js_1.StatusCode.BAD_REQUEST,
            body: 'Bad Request'
        });
    }
}
exports.GatewayRedirectDispatcher = GatewayRedirectDispatcher;
//# sourceMappingURL=gateway-redirect-dispatcher.js.map