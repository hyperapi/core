export type BaseRecord = Record<PropertyKey, unknown>;
export type EmptyObject = Record<symbol, never>;

/**
 * Check if a value is a record.
 * @param value -
 * @returns -
 */
export function isRecord(value: unknown): value is BaseRecord {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		value.constructor === Object &&
		Object.prototype.toString.call(value) === '[object Object]'
	);
}

/**
 * Checks if there are common keys in both object.
 * @param value1 -
 * @param value2 -
 * @returns -
 */
export function hasCommonKeys(value1: BaseRecord, value2: BaseRecord): boolean {
	for (const key of Object.keys(value2)) {
		if (Object.hasOwn(value1, key)) {
			return true;
		}
	}

	return false;
}
