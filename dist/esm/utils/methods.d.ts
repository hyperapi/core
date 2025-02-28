export type HyperAPIMethod = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'UNKNOWN';
/**
 * Checks if the given value is a valid HyperAPI method.
 * @param method The HTTP method to check.
 * @returns -
 */
export declare function isHyperApiMethod(method: unknown): method is HyperAPIMethod;
