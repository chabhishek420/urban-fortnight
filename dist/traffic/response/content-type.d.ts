/**
 * Content Type Constants
 *
 * @see keitaro_source/application/Traffic/Response/ContentType.php
 */
export declare enum ContentType {
    HEADER = "Content-Type",
    HTML = "text/html",
    TEXT = "text/plain",
    CSV = "text/csv",
    JSON = "application/json",
    JSONP = "application/javascript",
    JAVASCRIPT = "application/javascript",
    JS = "application/javascript",
    XML = "application/xml",
    OCTET_STREAM = "application/octet-stream",
    PNG = "image/png",
    JPEG = "image/jpeg",
    GIF = "image/gif",
    SVG = "image/svg+xml",
    ICO = "image/x-icon",
    FORM_URLENCODED = "application/x-www-form-urlencoded",
    MULTIPART_FORM = "multipart/form-data"
}
/**
 * Get content type from file extension
 */
export declare function getContentTypeFromExtension(extension: string): ContentType | string;
//# sourceMappingURL=content-type.d.ts.map