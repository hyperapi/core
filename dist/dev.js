import { NeoEvent, NeoEventTarget } from "neoevents";

//#region src/driver.ts
var HyperAPIDriver = class extends NeoEventTarget {};

//#endregion
//#region src/utils/methods.ts
/**
* Checks if the given value is a valid HyperAPI method.
* @param method The HTTP method to check.
* @returns -
*/
function isHyperApiMethod(method) {
	return method === "DELETE" || method === "GET" || method === "HEAD" || method === "OPTIONS" || method === "PATCH" || method === "POST" || method === "PUT" || method === "UNKNOWN";
}

//#endregion
export { HyperAPIDriver, isHyperApiMethod };