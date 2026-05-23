export type HyperAPIMethod =
	| 'DELETE'
	| 'GET'
	| 'HEAD'
	| 'OPTIONS'
	| 'PATCH'
	| 'POST'
	| 'PUT'
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
		|| method === 'HEAD'
		|| method === 'OPTIONS'
		|| method === 'PATCH'
		|| method === 'POST'
		|| method === 'PUT'
		|| method === 'UNDEF'
	);
}
