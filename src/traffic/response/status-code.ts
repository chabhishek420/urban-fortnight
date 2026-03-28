/**
 * HTTP Status Codes
 * 
 * @see keitaro_source/application/Traffic/Response/StatusCode.php
 */
export enum StatusCode {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  MOVED_TEMPORARILY = 302,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  PAYMENT_REQUIRED = 402,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

/**
 * Check if status code is successful (2xx)
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Check if status code is a redirect (3xx)
 */
export function isRedirectStatus(status: number): boolean {
  return status >= 300 && status < 400;
}

/**
 * Check if status code is a client error (4xx)
 */
export function isClientErrorStatus(status: number): boolean {
  return status >= 400 && status < 500;
}

/**
 * Check if status code is a server error (5xx)
 */
export function isServerErrorStatus(status: number): boolean {
  return status >= 500 && status < 600;
}
