import type { UnknownRecord } from 'type-fest';

/** Check if a value is a record. */
export function isRecord(value: unknown): value is UnknownRecord {
	return (
		typeof value === 'object'
		&& value !== null
		&& !Array.isArray(value)
		&& value.constructor === Object
		&& Object.prototype.toString.call(value) === '[object Object]'
	);
}

/** Checks if there are common keys in both object. */
export function hasCommonKeys(
	value1: UnknownRecord,
	value2: UnknownRecord,
): boolean {
	for (const key of Object.keys(value2)) {
		if (Object.hasOwn(value1, key)) {
			return true;
		}
	}

	return false;
}
