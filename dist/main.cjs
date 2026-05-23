const require_dev = require('./dev-B-VA0aHE.cjs');
let node_path = require("node:path");
node_path = require_dev.__toESM(node_path);
let itty_router = require("itty-router");
itty_router = require_dev.__toESM(itty_router);

//#region src/error.ts
var HyperAPIError = class extends Error {
	/** The error code. */
	code = 0;
	/** The error description. */
	description = "HyperAPI error";
	/** The error data. */
	data;
	/** HTTP status code. */
	httpStatus;
	/** HTTP headers to return. */
	httpHeaders;
	constructor(data) {
		super();
		if (require_dev.isRecord(data)) this.data = data;
	}
	get message() {
		return `${this.description} (code ${this.code}).`;
	}
	/**
	* Creates response object.
	* @returns -
	*/
	getResponse() {
		const response = { code: this.code };
		if (typeof this.description === "string") response.description = this.description;
		if (this.data) response.data = this.data;
		return response;
	}
};

//#endregion
//#region src/api-errors.ts
var HyperAPIAuthorizationError = class extends HyperAPIError {
	code = 1;
	description = "Authorization error";
	httpStatus = 401;
};
var HyperAPIInvalidParametersError = class extends HyperAPIError {
	code = 2;
	description = "One of the parameters specified was missing or invalid";
	httpStatus = 400;
};
var HyperAPIInternalError = class extends HyperAPIError {
	code = 3;
	description = "Internal error";
	httpStatus = 500;
};
var HyperAPIForbiddenError = class extends HyperAPIError {
	code = 4;
	description = "You do not have permission to perform this action";
	httpStatus = 403;
};
var HyperAPIUnknownMethodError = class extends HyperAPIError {
	code = 5;
	description = "Unknown method called";
	httpStatus = 404;
};
var HyperAPIUnknownMethodNotAllowedError = class extends HyperAPIError {
	code = 5;
	description = "Unknown method called";
	httpStatus = 405;
};
var HyperAPIObjectsLimitError = class extends HyperAPIError {
	code = 6;
	description = "Too many objects requested";
	httpStatus = 400;
};
var HyperAPIRateLimitError = class extends HyperAPIError {
	code = 7;
	description = "Rate limit exceeded";
	httpStatus = 429;
};
var HyperAPICaptchaError = class extends HyperAPIError {
	code = 8;
	description = "Captcha required";
	httpStatus = 428;
};
var HyperAPIBusyError = class extends HyperAPIError {
	code = 10;
	description = "Endpoint is busy";
	httpStatus = 503;
};
var HyperAPIConfirmationError = class extends HyperAPIError {
	code = 11;
	description = "Confirmation required";
	httpStatus = 409;
};
var HyperAPIOTPError = class extends HyperAPIError {
	code = 12;
	description = "One-time password required";
	httpStatus = 401;
};
var HyperAPIMaintenanceError = class extends HyperAPIError {
	code = 13;
	description = "Endpoint is in maintenance mode";
	httpStatus = 503;
};
var HyperAPIMethodNotAllowedError = class extends HyperAPIError {
	code = 14;
	description = "HTTP method not allowed";
	httpStatus = 405;
};

//#endregion
//#region src/module.ts
var HyperAPIModule = class {
	chain = [];
	use(fn) {
		this.chain.push(fn);
		return this;
	}
	set(key, arg1) {
		this.chain.push(async (request) => {
			const value = typeof arg1 === "function" ? await arg1(request) : arg1;
			if (value) return { [key]: value };
		});
		return this;
	}
	action(fn) {
		this.chain.push(async (request) => {
			const response = await fn(request);
			if (response) return { response };
		});
		return this;
	}
	async _run(request) {
		const request_result = request;
		for (const fn of this.chain) {
			const request_add = await fn(request_result);
			if (request_add) Object.assign(request_result, request_add);
		}
		return request_result;
	}
};

//#endregion
//#region src/response.ts
/**
* Checks if the given value is a HyperAPIResponse.
* @param response - The value to check.
* @returns True if the value is a HyperAPIResponse, false otherwise.
*/
function isHyperAPIResponse(response) {
	return response instanceof HyperAPIError || response instanceof Response || require_dev.isRecord(response) || Array.isArray(response) || response === void 0;
}

//#endregion
//#region src/router.ts
var HyperAPIRouter = class {
	#router = (0, itty_router.IttyRouter)();
	#routes_map = /* @__PURE__ */ new Map();
	constructor(path_root) {
		for (const route of require_dev.getRoutes(path_root)) {
			const router_response = Object.freeze({
				async getHandler() {
					return (await import(route.file_path)).default;
				},
				route_data: route,
				args: {}
			});
			let methods_by_route = this.#routes_map.get(route.route);
			if (methods_by_route) methods_by_route.set(route.method, router_response);
			else {
				methods_by_route = /* @__PURE__ */ new Map();
				methods_by_route.set(route.method, router_response);
				this.#routes_map.set(route.route, methods_by_route);
			}
		}
		for (const route of this.#routes_map.keys()) this.#router.all(route, (request) => {
			return {
				route,
				args: request.params
			};
		});
	}
	async fetch(method, path) {
		const url = `file://${path}`;
		const result = await this.#router.fetch({
			method,
			url
		});
		if (result) {
			const route_map = this.#routes_map.get(result.route);
			if (!route_map) throw new Error(`Internal HyperAPI error: route not found for ${result.route}`);
			const router_response = route_map.get(method);
			if (!router_response) return "METHOD_NOT_ALLOWED";
			return {
				...router_response,
				args: result.args
			};
		}
		return "NOT_EXISTS";
	}
};

//#endregion
//#region src/main.ts
const ENTRYPOINT_PATH = node_path.default.dirname(process.argv[1]);
var HyperAPI = class {
	#router;
	off;
	constructor(driver, root = node_path.default.join(ENTRYPOINT_PATH, "hyper-api")) {
		this.#router = new HyperAPIRouter(root);
		this.off = driver.on("request", async (event) => {
			const [request_external, response] = await this.processRequest(event.detail.request);
			if (this.hooks_response.length > 0) {
				const promises = [];
				for (const fn of this.hooks_response) try {
					const result = fn({
						...event.detail.request,
						...request_external,
						response
					});
					if (result instanceof Promise) promises.push(result.catch(console.error));
				} catch (error) {
					console.error(error);
				}
				await Promise.all(promises);
			}
			event.detail.callback(response);
		});
	}
	hooks_before_router = [];
	onBeforeRouter(fn) {
		this.hooks_before_router.push(fn);
		return this;
	}
	hooks_response = [];
	onResponse(fn) {
		this.hooks_response.push(fn);
		return this;
	}
	async processRequest(request) {
		const request_external = {};
		try {
			if (request.path.startsWith("/") !== true) request.path = `/${request.path}`;
			for (const fn of this.hooks_before_router) {
				const request_added = await fn({
					...request,
					...request_external
				});
				if (request_added !== void 0) Object.assign(request_external, request_added);
			}
			const router_response = await this.#router.fetch(request.method, request.path);
			if (router_response === "METHOD_NOT_ALLOWED") throw new HyperAPIUnknownMethodNotAllowedError();
			if (router_response === "NOT_EXISTS") throw new HyperAPIUnknownMethodError();
			if (require_dev.hasCommonKeys(router_response.args, request.args)) throw new HyperAPIInvalidParametersError();
			request.args = {
				...request.args,
				...router_response.args
			};
			const handler = await router_response.getHandler();
			if (handler === void 0) {
				console.error(`There is no handler in ${router_response.route_data.file_path}. Did you forget "export default" in the module?`);
				throw new HyperAPIInternalError();
			}
			const { response } = await handler._run({
				...request,
				...request_external
			});
			if (isHyperAPIResponse(response) !== true) throw new TypeError(`Invalid response type from module ${router_response.route_data.file_path}. Expected Response, HyperAPIError, array, object or undefined.`);
			return [request_external, response];
		} catch (error) {
			if (error instanceof HyperAPIError) return [request_external, error];
			console.error(error);
			return [request_external, new HyperAPIInternalError()];
		}
	}
	module() {
		return new HyperAPIModule();
	}
	destroy() {
		this.off();
	}
};

//#endregion
exports.HyperAPI = HyperAPI;
exports.HyperAPIAuthorizationError = HyperAPIAuthorizationError;
exports.HyperAPIBusyError = HyperAPIBusyError;
exports.HyperAPICaptchaError = HyperAPICaptchaError;
exports.HyperAPIConfirmationError = HyperAPIConfirmationError;
exports.HyperAPIError = HyperAPIError;
exports.HyperAPIForbiddenError = HyperAPIForbiddenError;
exports.HyperAPIInternalError = HyperAPIInternalError;
exports.HyperAPIInvalidParametersError = HyperAPIInvalidParametersError;
exports.HyperAPIMaintenanceError = HyperAPIMaintenanceError;
exports.HyperAPIMethodNotAllowedError = HyperAPIMethodNotAllowedError;
exports.HyperAPIOTPError = HyperAPIOTPError;
exports.HyperAPIObjectsLimitError = HyperAPIObjectsLimitError;
exports.HyperAPIRateLimitError = HyperAPIRateLimitError;
exports.HyperAPIUnknownMethodError = HyperAPIUnknownMethodError;
exports.HyperAPIUnknownMethodNotAllowedError = HyperAPIUnknownMethodNotAllowedError;