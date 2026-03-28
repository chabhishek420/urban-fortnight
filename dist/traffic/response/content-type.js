"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = void 0;
exports.getContentTypeFromExtension = getContentTypeFromExtension;
/**
 * Content Type Constants
 *
 * @see keitaro_source/application/Traffic/Response/ContentType.php
 */
var ContentType;
(function (ContentType) {
    ContentType["HEADER"] = "Content-Type";
    // Text types
    ContentType["HTML"] = "text/html";
    ContentType["TEXT"] = "text/plain";
    ContentType["CSV"] = "text/csv";
    // JSON types
    ContentType["JSON"] = "application/json";
    ContentType["JSONP"] = "application/javascript";
    // JavaScript
    ContentType["JAVASCRIPT"] = "application/javascript";
    ContentType["JS"] = "application/javascript";
    // XML types
    ContentType["XML"] = "application/xml";
    // Binary types
    ContentType["OCTET_STREAM"] = "application/octet-stream";
    // Image types
    ContentType["PNG"] = "image/png";
    ContentType["JPEG"] = "image/jpeg";
    ContentType["GIF"] = "image/gif";
    ContentType["SVG"] = "image/svg+xml";
    ContentType["ICO"] = "image/x-icon";
    // Form types
    ContentType["FORM_URLENCODED"] = "application/x-www-form-urlencoded";
    ContentType["MULTIPART_FORM"] = "multipart/form-data";
})(ContentType || (exports.ContentType = ContentType = {}));
/**
 * Get content type from file extension
 */
function getContentTypeFromExtension(extension) {
    const ext = extension.toLowerCase().replace(/^\./, '');
    const mapping = {
        html: ContentType.HTML,
        htm: ContentType.HTML,
        txt: ContentType.TEXT,
        json: ContentType.JSON,
        js: ContentType.JAVASCRIPT,
        css: 'text/css',
        xml: ContentType.XML,
        csv: ContentType.CSV,
        png: ContentType.PNG,
        jpg: ContentType.JPEG,
        jpeg: ContentType.JPEG,
        gif: ContentType.GIF,
        svg: ContentType.SVG,
        ico: ContentType.ICO
    };
    return mapping[ext] ?? ContentType.OCTET_STREAM;
}
//# sourceMappingURL=content-type.js.map