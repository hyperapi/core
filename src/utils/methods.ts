export type HyperAPIMethod =
	| 'DELETE'
	| 'GET'
	| 'OPTIONS'
	| 'PATCH'
	| 'POST'
	| 'PUT'
	| 'QUERY'
	| 'UNDEF';

/**
 * Checks if the given value is a valid HyperAPI method.
 * @param method The HTTP method to check.
 * @returns -
 */
export function isHyperApiMethod(method: unknown): method is HyperAPIMethod {
	return (
		method === 'DELETE'
		|| method === 'GET'
		|| method === 'OPTIONS'
		|| method === 'PATCH'
		|| method === 'POST'
		|| method === 'PUT'
		|| method === 'QUERY'
		|| method === 'UNDEF'
	);
}
