/**
 * Redirect Service
 * 
 * Provides helper methods for various redirect types.
 * 
 * @see keitaro_source/application/Traffic/Actions/Service/RedirectService.php
 */

export interface MetaRedirectOptions {
  delay?: number;
  noReferrer?: boolean;
}

/**
 * Redirect Service
 */
export class RedirectService {
  private static instance: RedirectService;

  static getInstance(): RedirectService {
    if (!RedirectService.instance) {
      RedirectService.instance = new RedirectService();
    }
    return RedirectService.instance;
  }

  /**
   * Generate script redirect code
   */
  scriptRedirect(url: string): string {
    return `function process() {
    window.location = "${url}";
}
window.onerror = process;
process();`;
  }

  /**
   * Generate frame redirect code
   */
  frameRedirect(url: string): string {
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
  metaRedirect(url: string, options: MetaRedirectOptions = {}): string {
    const delay = options.delay ?? 1;
    const noReferrer = options.noReferrer ?? false;

    const metas: string[] = [
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
