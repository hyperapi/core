//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const node_path = __toESM(require("node:path"));
const itty_router = __toESM(require("itty-router"));
const node_fs = __toESM(require("node:fs"));
const neoevents = __toESM(require("neoevents"));

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
		if (isRecord(data)) this.data = data;
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
		let request_result = request;
		for (const fn of this.chain) {
			const request_add = await fn(request_result);
			if (request_add) request_result = {
				...request_result,
				...request_add
			};
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
	return response instanceof HyperAPIError || response instanceof Response || isRecord(response) || Array.isArray(response) || response === void 0;
}

//#endregion
//#region src/router/filename.ts
const RE_OPTIONAL_CATCH_ALL = /^\[\[\.\.\.([a-z_][\da-z_]*)\]\]$/i;
const RE_GREEDY = /^\[\.\.\.([a-z_][\da-z_]*)\]$/i;
/**
* Returns specificity for route.
*
* Values:
* - 0: static route (e.g. `/foo`)
* - 1: route with parameter (e.g. `/foo-:id`)
* - 2: route with optional parameter (e.g. `/foo-:id?`)
* - 3: route with greedy parameter (e.g. `/foo-:id+`)
* - 4: (NOT USED) route with wildcard (e.g. `/*`)
* @param name -
* @returns -
*/
function parseFilename(name) {
	if (name === "index" || name.length === 0) return { self: true };
	const match_optional_catch_all = RE_OPTIONAL_CATCH_ALL.exec(name);
	if (match_optional_catch_all) return {
		self: true,
		route: {
			part: `:${match_optional_catch_all[1]}+`,
			specificity: {
				type: 3,
				static_length: 0
			}
		}
	};
	const match_greedy = RE_GREEDY.exec(name);
	if (match_greedy) return { route: {
		part: `:${match_greedy[1]}+`,
		specificity: {
			type: 3,
			static_length: 0
		}
	} };
	let has_optional = false;
	let static_length = name.length;
	const route_part = name.replaceAll(/(\[([a-z_][\da-z_]*)\]|\[\[([a-z_][\da-z_]*)\]\])([^\da-z_]|$)/gi, (...args) => {
		static_length -= args[1].length;
		if (args[3] !== void 0) {
			has_optional = true;
			return `:${args[3]}?${args[4]}`;
		}
		return `:${args[2]}${args[4]}`;
	});
	if (name !== route_part) return { route: {
		part: route_part,
		specificity: {
			type: has_optional ? 2 : 1,
			static_length
		}
	} };
	if (name.includes("[") !== true) return { route: {
		part: route_part,
		specificity: {
			type: 0,
			static_length: 0
		}
	} };
	throw new Error(`Invalid filename "${name}".`);
}

//#endregion
//#region src/router/file-tree.ts
const RE_EXT = /\.([cm]?[jt]s)$/i;
const RE_METHOD = /\.(delete|get|head|options|patch|post|put)$/i;
var WalkSpecificityPosition = /* @__PURE__ */ function(WalkSpecificityPosition$1) {
	WalkSpecificityPosition$1[WalkSpecificityPosition$1["FILE_METHOD"] = 0] = "FILE_METHOD";
	WalkSpecificityPosition$1[WalkSpecificityPosition$1["FILE_ALL"] = 1] = "FILE_ALL";
	WalkSpecificityPosition$1[WalkSpecificityPosition$1["DIRECTORY"] = 2] = "DIRECTORY";
	return WalkSpecificityPosition$1;
}(WalkSpecificityPosition || {});
/**
* Reads the file system and returns a tree of routes sorted correctly.
* @param path_given The directory to read.
* @param _state Internal state.
* @returns -
*/
function readFiles(path_given, _state) {
	_state ??= {
		route: null,
		specificity: {
			type: 0,
			static_length: 0,
			position: WalkSpecificityPosition.DIRECTORY
		}
	};
	const result_directory = {
		specificity: _state.specificity,
		children: []
	};
	const result_routes = [];
	const entries = (0, node_fs.readdirSync)(path_given, { withFileTypes: true });
	if (process.env.NODE_ENV === "test") for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[entries[i], entries[j]] = [entries[j], entries[i]];
	}
	for (const entry of entries) {
		const path = node_path.default.join(entry.parentPath, entry.name);
		if (entry.isFile()) {
			let name = entry.name.replace(RE_EXT, "");
			if (name.endsWith(".test")) continue;
			let method = "all";
			name = name.replace(RE_METHOD, (_, g1) => {
				method = g1.toLowerCase();
				return "";
			});
			const { self, route } = parseFilename(name);
			const specificity_position = method === "all" ? WalkSpecificityPosition.FILE_ALL : WalkSpecificityPosition.FILE_METHOD;
			if (self) result_routes.push({
				specificity: {
					..._state.specificity,
					position: specificity_position
				},
				method,
				route: _state.route ?? "/",
				path
			});
			if (route) result_directory.children.push({
				specificity: {
					...route.specificity,
					position: specificity_position
				},
				method,
				route: (_state.route ?? "") + node_path.default.sep + route.part,
				path
			});
		} else if (entry.isDirectory()) {
			const { self, route } = parseFilename(entry.name);
			if (self) throw new Error(`Invalid directory name "${entry.name}" at "${path}". Can not use optional catch-all in directory name.`);
			if (!route) throw new Error(`Invalid directory name "${entry.name}" at "${path}".`);
			result_directory.children.push(...readFiles(path, {
				route: (_state.route ?? "") + node_path.default.sep + route.part,
				specificity: {
					...route.specificity,
					position: WalkSpecificityPosition.DIRECTORY
				}
			}));
		}
	}
	sortRoutes(result_directory.children);
	const result = [result_directory, ...result_routes];
	if (_state.route === null) sortRoutes(result);
	return result;
}
/**
* Sorts the routes in the given result.
* @param result The result to sort.
* @returns -
*/
function sortRoutes(result) {
	return result.sort((a, b) => {
		if (a.specificity.type !== b.specificity.type) return a.specificity.type - b.specificity.type;
		if (a.specificity.static_length !== b.specificity.static_length) return b.specificity.static_length - a.specificity.static_length;
		if (a.specificity.position !== b.specificity.position) return a.specificity.position - b.specificity.position;
		return 0;
	});
}

//#endregion
//#region src/router.ts
/**
* Creates new IttyRouter from filesystem.
* @param path_root The path to scan.
* @returns The new IttyRouter.
*/
function createRouter(path_root) {
	const router = (0, itty_router.IttyRouter)();
	const routes = readFiles(path_root);
	fillRouter(routes, router);
	return router;
}
/**
* Attaches routes to IttyRouter.
* @param routes The routes to attach.
* @param router The IttyRouter to attach to.
*/
function fillRouter(routes, router) {
	for (const route of routes) if ("method" in route) router[route.method](route.route, (request) => ({
		async getHandler() {
			const module_ = await import(route.path);
			return module_.default;
		},
		path: route.path,
		args: request.params
	}));
	else if ("children" in route) fillRouter(route.children, router);
}
/**
* Fetches data from router.
* @param router The router to fetch data from.
* @param method The HTTP method.
* @param path The path to fetch data from.
* @returns The response.
*/
async function useRouter(router, method, path) {
	const url = `file://${path}`;
	const result = await router.fetch({
		method,
		url
	});
	if (result) return result;
	const result_unknown = await router.fetch({
		method: "UNKNOWN",
		url
	});
	return result_unknown ? "INVALID" : "NOT_EXISTS";
}

//#endregion
//#region src/driver.ts
var HyperAPIDriver = class extends neoevents.NeoEventTarget {};

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
//#region src/main.ts
const ENTRYPOINT_PATH = node_path.default.dirname(process.argv[1]);
var HyperAPI = class {
	router;
	off;
	constructor(driver, root = node_path.default.join(ENTRYPOINT_PATH, "hyper-api")) {
		this.router = createRouter(root);
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
		let request_external = {};
		try {
			if (request.path.startsWith("/") !== true) request.path = `/${request.path}`;
			for (const fn of this.hooks_before_router) {
				const request_added = await fn({
					...request,
					...request_external
				});
				if (request_added !== void 0) request_external = {
					...request_external,
					...request_added
				};
			}
			const router_response = await useRouter(this.router, request.method, request.path);
			if (router_response === "INVALID") throw new HyperAPIUnknownMethodNotAllowedError();
			if (router_response === "NOT_EXISTS") throw new HyperAPIUnknownMethodError();
			if (hasCommonKeys(router_response.args, request.args)) throw new HyperAPIInvalidParametersError();
			request.args = {
				...request.args,
				...router_response.args
			};
			const handler = await router_response.getHandler();
			const { response } = await handler._run({
				...request,
				...request_external
			});
			if (isHyperAPIResponse(response) !== true) throw new TypeError(`Invalid response type from module ${router_response.path}. Expected Response, HyperAPIError, array, object or undefined.`);
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
exports.HyperAPIDriver = HyperAPIDriver;
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
exports.isHyperApiMethod = isHyperApiMethod;