/**
 * Content Type Constants
 * 
 * @see keitaro_source/application/Traffic/Response/ContentType.php
 */
export enum ContentType {
  HEADER = 'Content-Type',
  
  // Text types
  HTML = 'text/html',
  TEXT = 'text/plain',
  CSV = 'text/csv',
  
  // JSON types
  JSON = 'application/json',
  JSONP = 'application/javascript',
  
  // JavaScript
  JAVASCRIPT = 'application/javascript',
  JS = 'application/javascript',
  
  // XML types
  XML = 'application/xml',
  
  // Binary types
  OCTET_STREAM = 'application/octet-stream',
  
  // Image types
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
  ICO = 'image/x-icon',
  
  // Form types
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  MULTIPART_FORM = 'multipart/form-data'
}

/**
 * Get content type from file extension
 */
export function getContentTypeFromExtension(extension: string): ContentType | string {
  const ext = extension.toLowerCase().replace(/^\./, '');
  const mapping: Record<string, ContentType | string> = {
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
