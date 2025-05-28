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
const node_fs = __toESM(require("node:fs"));
const itty_router = __toESM(require("itty-router"));

//#region src/utils/is-record.ts
/**
* Check if a value is a record.
* @param value -
* @returns -
*/
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";
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
//#region src/router.ts
/**
* Creates new IttyRouter from filesystem.
* @param path The path to scan.
* @returns The new IttyRouter.
*/
function createRouter(path) {
	const router = (0, itty_router.IttyRouter)();
	scanDirectory(router, path);
	return router;
}
/**
* Fetches data from router.
* @param router The router to fetch data from.
* @param method The HTTP method.
* @param path The path to fetch data from.
* @returns The response.
*/
function useRouter(router, method, path) {
	return router.fetch({
		method,
		url: `file://${path}`
	});
}
const REGEXP_FILE_EXTENSION = /\.(js|mjs|cjs|ts)$/;
const REGEXP_TEST_FILE_EXTENSION = /\.test\.(js|mjs|cjs|ts)$/;
const REGEXP_HTTP_METHOD = /\.\[(delete|get|head|options|patch|post|put)]$/;
const REGEXP_PATH_SLUG = /\[(\w+)]/g;
/**
* Scans directory for routes.
* @param router The router to add routes to.
* @param path The path to scan.
* @param [regexp_parts] The parts of the regular expression.
*/
function scanDirectory(router, path, regexp_parts = [""]) {
	const result = (0, node_fs.readdirSync)(path, { withFileTypes: true });
	const routes = {
		"0": [],
		"1": [],
		"2": [],
		"3": []
	};
	for (const entry of result) {
		const entry_path = node_path.default.join(path, entry.name);
		if (entry.isFile()) {
			let file_name = entry.name;
			if (REGEXP_FILE_EXTENSION.test(file_name) && REGEXP_TEST_FILE_EXTENSION.test(file_name) !== true) {
				file_name = file_name.replace(REGEXP_FILE_EXTENSION, "");
				let method = "all";
				const method_match = file_name.match(REGEXP_HTTP_METHOD);
				const has_method = method_match ? 1 : 0;
				if (method_match) {
					method = method_match[1];
					file_name = file_name.replace(REGEXP_HTTP_METHOD, "");
				}
				const has_slug = REGEXP_PATH_SLUG.test(file_name) ? 2 : 0;
				file_name = file_name.replaceAll(REGEXP_PATH_SLUG, ":$1");
				routes[has_method | has_slug]?.push({
					method,
					path: [...regexp_parts, file_name].join(node_path.default.sep),
					module_path: entry_path
				});
			}
		} else scanDirectory(router, entry_path, [...regexp_parts, entry.name.replaceAll(REGEXP_PATH_SLUG, ":$1")]);
	}
	for (const route of [
		...routes[1],
		...routes[3],
		...routes[0],
		...routes[2]
	]) router[route.method](route.path, (r) => {
		const response = {
			module_path: route.module_path,
			args: r.params
		};
		return response;
	});
}

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
	driver;
	/**
	* Creates a HyperAPI instance.
	* @param options The options.
	* @param options.driver The driver.
	* @param [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
	*/
	constructor({ driver, root = node_path.default.join(ENTRYPOINT_PATH, "hyper-api") }) {
		this.driver = driver;
		this.router = createRouter(root);
		this.driver.start(async (arg0) => {
			const driver_request = arg0;
			const [request, module_, response] = await this.processRequest(driver_request);
			try {
				await this.useHooks(this.handlers.response, {
					driver_request,
					request,
					module: module_,
					response
				});
			} catch (error) {
				console.error("Error in \"response\" hook:");
				console.error(error);
			}
			return response;
		});
	}
	handlers = {
		beforeRouter: [],
		requestTransformer: void 0,
		beforeExecute: [],
		response: []
	};
	/**
	* Adds a hook to be called before request is matched against the file router.
	*
	* This hook can be set multiple times. Every hook is executed simultaneously.
	*
	* If error is thrown in this hook, it will abort the request processing and return an error response.
	* @param callback The callback function.
	*/
	onBeforeRouter(callback) {
		this.handlers.beforeRouter.push(callback);
		return this;
	}
	/**
	* Use this hook add properties to the request before it is send to the API module.
	*
	* This hook can be set only once.
	*
	* If error is thrown in this hook, it will abort the request processing and return an error response.
	* @param transformer The callback function.
	*/
	setRequestTransformer(transformer) {
		if (this.handlers.requestTransformer) throw new Error("Transformer has already been set.");
		this.handlers.requestTransformer = transformer;
		return this;
	}
	/**
	* Adds a hook to be called right before the API module is executed.
	*
	* This hook can be set multiple times. Every hook is executed simultaneously.
	*
	* If error is thrown in this hook, it will abort the request processing and return an error response.
	* @param callback -
	*/
	onBeforeExecute(callback) {
		this.handlers.beforeExecute.push(callback);
		return this;
	}
	/**
	* Adds a hook to be called right before the response is sent back to the driver.
	*
	* This hook can be set multiple times. Every hook is executed simultaneously.
	*
	* If error is thrown in this hook, it will be printed to the console, but will not prevent response from being sent to the driver.
	* @param callback -
	*/
	onResponse(callback) {
		this.handlers.response.push(callback);
		return this;
	}
	async useHooks(hooks, ctx) {
		const promises = [];
		for (const hook of hooks) promises.push(hook(ctx));
		await Promise.all(promises);
	}
	async processRequest(driver_request) {
		let request = null;
		let module_ = null;
		try {
			if (driver_request.path.startsWith("/") !== true) driver_request.path = `/${driver_request.path}`;
			await this.useHooks(this.handlers.beforeRouter, { driver_request });
			const router_response = await useRouter(this.router, driver_request.method, driver_request.path);
			if (!router_response) throw new HyperAPIUnknownMethodError();
			driver_request.args = {
				...driver_request.args,
				...router_response.args
			};
			module_ = await import(router_response.module_path);
			if (module_.argsValidator) try {
				driver_request.args = module_.argsValidator(driver_request.args);
			} catch (error) {
				console.error(error);
				throw new HyperAPIInvalidParametersError();
			}
			request = this.handlers.requestTransformer ? await this.handlers.requestTransformer({
				driver_request,
				module: module_
			}) : driver_request;
			await this.useHooks(this.handlers.beforeExecute, {
				request,
				module: module_
			});
			const response = await module_.default(request);
			return [
				request,
				module_,
				response
			];
		} catch (error) {
			if (error instanceof HyperAPIError) return [
				request,
				module_,
				error
			];
			console.error(error);
			return [
				request,
				module_,
				new HyperAPIInternalError()
			];
		}
	}
	/** Destroys the HyperAPI instance. */
	destroy() {
		this.handlers.beforeRouter.splice(0);
		this.handlers.requestTransformer = void 0;
		this.handlers.beforeExecute.splice(0);
		this.handlers.response.splice(0);
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
exports.isHyperApiMethod = isHyperApiMethod;