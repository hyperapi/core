//#region src/utils/record.ts
/**
* Check if a value is a record.
* @param value -
* @returns -
*/
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";
}
/**
* Checks if there are common keys in both object.
* @param value1 -
* @param value2 -
* @returns -
*/
function hasCommonKeys(value1, value2) {
	for (const key of Object.keys(value2)) if (Object.hasOwn(value1, key)) return true;
	return false;
}

//#endregion
export { hasCommonKeys, isRecord };