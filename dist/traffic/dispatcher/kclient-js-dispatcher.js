"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KClientJSDispatcher = void 0;
/**
 * KClient JS Dispatcher
 *
 * Handles JavaScript client tracking requests.
 * Generates JavaScript code for client-side tracking integration.
 *
 * @see keitaro_source/application/Traffic/Dispatcher/KClientJSDispatcher.php
 */
const click_api_dispatcher_js_1 = require("./click-api-dispatcher.js");
const response_js_1 = require("../response/response.js");
const status_code_js_1 = require("../response/status-code.js");
const content_type_js_1 = require("../response/content-type.js");
class KClientJSDispatcher extends click_api_dispatcher_js_1.ClickApiDispatcher {
    constructor(payload, version = 2) {
        super(payload, version);
    }
    /**
     * Dispatch and return JS client code
     */
    dispatch(request) {
        const isNew = request.getParam('_new') === '1';
        // If no sub_id or new flag, generate new tracking code
        if (!request.hasParam('sub_id') || isNew) {
            return this.getCodeWithoutSubId(request);
        }
        // Return code with existing sub_id
        return this.getCodeWithSubId(request);
    }
    /**
     * Get code for new visitors (no sub_id)
     */
    getCodeWithoutSubId(request) {
        this.setVersion(3);
        const response = super.dispatch(request);
        if (!response) {
            throw new Error('Empty response');
        }
        if (response.getStatus() !== status_code_js_1.StatusCode.OK) {
            return response;
        }
        // Get data for JS client generation
        const payload = this.getPipelinePayload();
        const rawClick = payload.getRawClick();
        const subId = rawClick?.getSubId() ?? '';
        const token = rawClick?.get('token') ?? '';
        const name = request.getParam('name');
        // Parse response body for content
        let content = null;
        try {
            const body = response.getBody();
            if (body) {
                content = JSON.parse(body.toString());
            }
        }
        catch {
            // Ignore parse errors
        }
        // Generate JS client code
        const jsClient = this.generateClientCode(request, subId, token, content, name);
        return response
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.JAVASCRIPT)
            .withBody(jsClient);
    }
    /**
     * Get code for existing visitors (with sub_id)
     */
    getCodeWithSubId(request) {
        const subId = request.getParam('sub_id') ?? '';
        const token = request.getParam('token') ?? '';
        const name = request.getParam('name');
        // Generate simple JS client code
        const jsClient = this.generateClientCode(request, subId, token, '', name);
        return response_js_1.Response.build()
            .withHeader(content_type_js_1.ContentType.HEADER, content_type_js_1.ContentType.JAVASCRIPT)
            .withBody(jsClient);
    }
    /**
     * Generate JavaScript client code
     */
    generateClientCode(_request, subId, token, content, name) {
        // In production: Use CodeGenerator for full implementation
        const clientName = name || 'KClient';
        return `
// Keitaro Tracking Client
(function() {
  var ${clientName} = {
    subId: "${subId}",
    token: "${token}",
    ${content ? `data: ${JSON.stringify(content)},` : ''}
    
    track: function(event, params) {
      // Track event
      var url = window.location.origin + '/track?sub_id=' + this.subId + '&event=' + event;
      if (params) {
        for (var key in params) {
          url += '&' + key + '=' + encodeURIComponent(params[key]);
        }
      }
      var img = new Image();
      img.src = url;
    },
    
    updateToken: function(token) {
      this.token = token;
    }
  };
  
  window.${clientName} = ${clientName};
})();
`.trim();
    }
}
exports.KClientJSDispatcher = KClientJSDispatcher;
//# sourceMappingURL=kclient-js-dispatcher.js.map