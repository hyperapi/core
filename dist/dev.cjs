const require_record = require('./record-D97pjgdq.cjs');
let neoevents = require("neoevents");
neoevents = require_record.__toESM(neoevents);

//#region src/driver.ts
var HyperAPIDriver = class extends neoevents.NeoEventTarget {
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
exports.HyperAPIDriver = HyperAPIDriver;
exports.isHyperApiMethod = isHyperApiMethod;
exports.isRecord = require_record.isRecord;