"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
exports.isSuccessStatus = isSuccessStatus;
exports.isRedirectStatus = isRedirectStatus;
exports.isClientErrorStatus = isClientErrorStatus;
exports.isServerErrorStatus = isServerErrorStatus;
/**
 * HTTP Status Codes
 *
 * @see keitaro_source/application/Traffic/Response/StatusCode.php
 */
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["CONTINUE"] = 100] = "CONTINUE";
    StatusCode[StatusCode["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    StatusCode[StatusCode["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    StatusCode[StatusCode["FOUND"] = 302] = "FOUND";
    StatusCode[StatusCode["SEE_OTHER"] = 303] = "SEE_OTHER";
    StatusCode[StatusCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    StatusCode[StatusCode["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    StatusCode[StatusCode["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    StatusCode[StatusCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    StatusCode[StatusCode["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
    StatusCode[StatusCode["GONE"] = 410] = "GONE";
    StatusCode[StatusCode["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    StatusCode[StatusCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    StatusCode[StatusCode["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    StatusCode[StatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    StatusCode[StatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    StatusCode[StatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    StatusCode[StatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
/**
 * Check if status code is successful (2xx)
 */
function isSuccessStatus(status) {
    return status >= 200 && status < 300;
}
/**
 * Check if status code is a redirect (3xx)
 */
function isRedirectStatus(status) {
    return status >= 300 && status < 400;
}
/**
 * Check if status code is a client error (4xx)
 */
function isClientErrorStatus(status) {
    return status >= 400 && status < 500;
}
/**
 * Check if status code is a server error (5xx)
 */
function isServerErrorStatus(status) {
    return status >= 500 && status < 600;
}
//# sourceMappingURL=status-code.js.map