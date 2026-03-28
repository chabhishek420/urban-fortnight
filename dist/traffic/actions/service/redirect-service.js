"use strict";
/**
 * Redirect Service
 *
 * Provides helper methods for various redirect types.
 *
 * @see keitaro_source/application/Traffic/Actions/Service/RedirectService.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectService = void 0;
/**
 * Redirect Service
 */
class RedirectService {
    static instance;
    static getInstance() {
        if (!RedirectService.instance) {
            RedirectService.instance = new RedirectService();
        }
        return RedirectService.instance;
    }
    /**
     * Generate script redirect code
     */
    scriptRedirect(url) {
        return `function process() {
    window.location = "${url}";
}
window.onerror = process;
process();`;
    }
    /**
     * Generate frame redirect code
     */
    frameRedirect(url) {
        return `<script type="application/javascript">
function process() {
    top.location = "${url}";
}

window.onerror = process;

if (top.location.href != window.location.href) {
    process()
}
</script>`;
    }
    /**
     * Generate meta redirect HTML
     */
    metaRedirect(url, options = {}) {
        const delay = options.delay ?? 1;
        const noReferrer = options.noReferrer ?? false;
        const metas = [
            `<meta http-equiv="REFRESH" content="${delay}; URL='${url}'">`
        ];
        if (noReferrer) {
            metas.push('<meta name="referrer" content="no-referrer" />');
        }
        const metasHtml = metas.join('\n    ');
        return `<html lang="en">
  <head>
    ${metasHtml}
    <title></title>
  </head>
</html>`;
    }
}
exports.RedirectService = RedirectService;
//# sourceMappingURL=redirect-service.js.map