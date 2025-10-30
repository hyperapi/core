import { n as isRecord } from "./record-BeJ2ZKAR.js";
import { NeoEvent, NeoEventTarget } from "neoevents";

//#region src/driver.ts
var HyperAPIDriver = class extends NeoEventTarget {
	emitRequest(request) {
		return new Promise((resolve) => {
			this.emit("request", {
				request,
				callback: resolve
			});
		});
	}
};

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
export { HyperAPIDriver, isHyperApiMethod, isRecord };