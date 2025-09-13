import { HyperAPIError } from './error.js';
import type { HyperAPIModuleResponse } from './module.js';
import { isRecord } from './utils/record.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;

/**
 * Checks if the given value is a HyperAPIResponse.
 * @param response - The value to check.
 * @returns True if the value is a HyperAPIResponse, false otherwise.
 */
export function isHyperAPIResponse(
	response: unknown,
): response is HyperAPIResponse {
	return (
		response instanceof HyperAPIError ||
		response instanceof Response ||
		isRecord(response) ||
		Array.isArray(response) ||
		response === undefined
	);
}
