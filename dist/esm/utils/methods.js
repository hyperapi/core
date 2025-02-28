/**
 * Checks if the given value is a valid HyperAPI method.
 * @param method The HTTP method to check.
 * @returns -
 */
export function isHyperApiMethod(method) {
    return method === 'DELETE'
        || method === 'GET'
        || method === 'HEAD'
        || method === 'OPTIONS'
        || method === 'PATCH'
        || method === 'POST'
        || method === 'PUT'
        || method === 'UNKNOWN';
}
