export type HyperAPIMethod =
	| 'DELETE'
	| 'GET'
	| 'OPTIONS'
	| 'PATCH'
	| 'POST'
	| 'PUT'
	| 'UNDEF';
const METHODS = new Set<unknown>([
	'DELETE',
	'GET',
	'OPTIONS',
	'PATCH',
	'POST',
	'PUT',
	'UNDEF',
]);

/**
 * Checks if the given value is a valid HyperAPI method.
 * @param method The HTTP method to check.
 * @returns -
 */
export function isHyperApiMethod(method: unknown): method is HyperAPIMethod {
	return METHODS.has(method);
}
