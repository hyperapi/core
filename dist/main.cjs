var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.js
var main_exports = {};
__export(main_exports, {
  HyperAPI: () => HyperAPI,
  HyperAPIAuthorizationError: () => HyperAPIAuthorizationError,
  HyperAPIBusyError: () => HyperAPIBusyError,
  HyperAPICaptchaError: () => HyperAPICaptchaError,
  HyperAPIConfirmationError: () => HyperAPIConfirmationError,
  HyperAPIDriver: () => HyperAPIDriver,
  HyperAPIError: () => HyperAPIError,
  HyperAPIForbiddenError: () => HyperAPIForbiddenError,
  HyperAPIInternalError: () => HyperAPIInternalError,
  HyperAPIInvalidParametersError: () => HyperAPIInvalidParametersError,
  HyperAPIMaintenanceError: () => HyperAPIMaintenanceError,
  HyperAPIOTPError: () => HyperAPIOTPError,
  HyperAPIObjectsLimitError: () => HyperAPIObjectsLimitError,
  HyperAPIRateLimitError: () => HyperAPIRateLimitError,
  HyperAPIRequest: () => HyperAPIRequest,
  HyperAPIResponse: () => HyperAPIResponse,
  HyperAPIUnknownMethodError: () => HyperAPIUnknownMethodError
});
module.exports = __toCommonJS(main_exports);
var import_node_path2 = require("node:path");

// src/error.js
var HyperAPIError = class extends Error {
  /**
   * The error code.
   * @type {number}
   * @readonly
   */
  code;
  /**
   * The error description.
   * @type {string?}
   * @readonly
   */
  description = null;
  /**
   * The error data.
   * @type {{[key: string]: any}}
   * @readonly
   */
  data;
  /** @type {number?} */
  httpStatus;
  /** @type {Record<string, any>?} */
  httpHeaders;
  /**
   * @param {{[key: string]: any}} [data] The error data.
   */
  constructor(data) {
    super();
    if (data !== null && typeof data === "object") {
      this.data = data;
    } else if (data !== void 0) {
      throw new TypeError("Argument 0 must be an object or not be provided");
    }
  }
  /**
   * @returns {string} -
   */
  get message() {
    return `${this.description ?? ""} (code ${this.code})`;
  }
  /**
   * Creates response object.
   * @returns {HyperAPIErrorResponse} -
   */
  getResponse() {
    const result = {
      code: this.code
    };
    if (typeof this.description === "string") {
      result.description = this.description;
    }
    if (this.data) {
      result.data = this.data;
    }
    return result;
  }
};

// src/api-errors.js
var HyperAPIAuthorizationError = class extends HyperAPIError {
  code = 1;
  description = "Authorization error";
  httpStatus = 401;
  // Unauthorized
};
var HyperAPIInvalidParametersError = class extends HyperAPIError {
  code = 2;
  description = "One of the parameters specified was missing or invalid";
  httpStatus = 400;
  // Bad Request
};
var HyperAPIInternalError = class extends HyperAPIError {
  code = 3;
  description = "Internal error";
  httpStatus = 500;
  // Internal Server Error
};
var HyperAPIForbiddenError = class extends HyperAPIError {
  code = 4;
  description = "You do not have permission to perform this action";
  httpStatus = 403;
  // Forbidden
};
var HyperAPIUnknownMethodError = class extends HyperAPIError {
  code = 5;
  description = "Unknown method called";
  httpStatus = 404;
  // Not Found
};
var HyperAPIObjectsLimitError = class extends HyperAPIError {
  code = 6;
  description = "Too many objects requested";
  httpStatus = 400;
  // Bad Request
};
var HyperAPIRateLimitError = class extends HyperAPIError {
  code = 7;
  description = "Rate limit exceeded";
  httpStatus = 429;
  // Too Many Requests
};
var HyperAPICaptchaError = class extends HyperAPIError {
  code = 8;
  description = "Captcha required";
  httpStatus = 428;
  // Precondition Required
};
var HyperAPIBusyError = class extends HyperAPIError {
  code = 10;
  description = "Endpoint is busy";
  httpStatus = 503;
  // Service Unavailable
};
var HyperAPIConfirmationError = class extends HyperAPIError {
  code = 11;
  description = "Confirmation required";
  httpStatus = 409;
  // Conflict
};
var HyperAPIOTPError = class extends HyperAPIError {
  code = 12;
  description = "One-time password required";
  httpStatus = 401;
  // Unauthorized
};
var HyperAPIMaintenanceError = class extends HyperAPIError {
  code = 13;
  description = "Endpoint is in maintenance mode";
  httpStatus = 503;
  // Service Unavailable
};

// src/request.js
var import_node_crypto = require("node:crypto");
var HyperAPIRequest = class extends Event {
  /**
   * The unique identifier for this request.
   * @type {string}
   * @readonly
   */
  response_event_name = "response:" + (0, import_node_crypto.randomUUID)();
  /**
   * The relative path to the JavaScript module that contains requested API method.
   * @type {string}
   * @readonly
   */
  module_path;
  /**
   * Request arguments to pass to the API method.
   * @type {HyperAPIRequestArgs}
   * @readonly
   */
  args;
  /**
   * @param {string} module_path The relative path to the API method module.
   * @param {HyperAPIRequestArgs} args The arguments to pass to the API method.
   */
  constructor(module_path, args) {
    super("request");
    this.module_path = module_path;
    this.args = args;
  }
};

// src/response.js
var HyperAPIResponse = class extends Event {
  /**
   * Creates a HyperAPI response.
   * @param {HyperAPIRequest} request The request.
   * @param {HyperAPIError | Record<string, any> | any[]} value The error or the response value.
   */
  constructor(request, value) {
    super(request.response_event_name);
    if (value instanceof HyperAPIError) {
      this.error = value;
    } else if (value === void 0) {
      this.data = {};
    } else if (value !== null && typeof value === "object" || Array.isArray(value)) {
      this.data = value;
    } else {
      throw new TypeError("Argument 0 must be an instance of HyperAPIError or be an object or an array.");
    }
  }
  /**
   * @returns {boolean} Whether the response is successful.
   * @readonly
   */
  get is_success() {
    return this.error === void 0;
  }
  /**
   * Returns response as an object. For example, that can be used as the body of a HTTP response.
   * @returns {{[key: string]: *}?} The response.
   */
  getResponse() {
    if (this.error) {
      return this.error.getResponse();
    }
    return this.data;
  }
};

// src/driver.js
var HyperAPIDriver = class extends EventTarget {
  /**
   * @param {HyperAPIRequest} request -
   * @returns {Promise<HyperAPIResponse>} -
   */
  async processRequest(request) {
    const promise = new Promise((resolve) => {
      this.addEventListener(
        request.response_event_name,
        (response) => {
          if (response instanceof HyperAPIResponse) {
            resolve(response);
          }
        },
        {
          once: true
        }
      );
    });
    this.dispatchEvent(request);
    return promise;
  }
};

// src/utils/extract-module-not-found-path.js
var import_node_path = require("node:path");
var REGEXP_MODULE_SPECIFIER = /Cannot find module ["'](.+)["'] (?:imported\s)?from/;
var REGEXP_MODULE_REQUESTER = /\s(?:imported\s)?from ["'](.+)["']/;
function extractPath(error) {
  if (typeof error.specifier === "string") {
    return error.specifier;
  }
  if (error.url instanceof URL) {
    return error.url.pathname;
  }
  if (typeof error.url === "string") {
    return new URL(error.url).pathname;
  }
  const match = error.message.match(REGEXP_MODULE_SPECIFIER);
  if (match !== null) {
    return match[1];
  }
  throw error;
}
function extractModuleNotFoundPath(error) {
  const path = extractPath(error);
  if (path.startsWith("/")) {
    return path;
  }
  const match = error.message.match(REGEXP_MODULE_REQUESTER);
  if (match !== null) {
    const specifier_from = match[1];
    return (0, import_node_path.join)(
      (0, import_node_path.dirname)(specifier_from),
      path
    );
  }
  throw error;
}

// src/main.js
var ENTRYPOINT_PATH = (0, import_node_path2.dirname)(process.argv[1]);
var HyperAPI = class {
  /** @type {HyperAPIDriver} The HyperAPI driver. */
  #driver;
  /** @type {string} The root directory for API methods modules. */
  #root;
  /** @type {function(HyperAPIRequest): void} Handles a request. */
  #requestHandler;
  /**
   * Creates a HyperAPI instance.
   * @param {object} options The options.
   * @param {HyperAPIDriver} options.driver The HyperAPI driver.
   * @param {string} [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
   */
  constructor({
    driver,
    root = (0, import_node_path2.join)(
      ENTRYPOINT_PATH,
      "hyper-api"
    )
  }) {
    if (driver instanceof HyperAPIDriver !== true) {
      throw new TypeError('Property "driver" must be an instance of HyperAPIDriver.');
    }
    this.#driver = driver;
    this.#requestHandler = async (request) => {
      try {
        const response = await this.#handleRequest(request);
        this.#driver.dispatchEvent(response);
      } catch (error) {
        console.error("Unexpected error happened:");
        console.error(error);
        console.error("This error should not have reached this point.");
        console.error("This is probably a bug in the HyperAPI driver you are using or in the HyperAPI itself.");
        console.error("Now exiting the process.");
        process.exit(1);
      }
    };
    this.#driver.addEventListener(
      "request",
      this.#requestHandler
    );
    this.#root = root;
  }
  /**
   * Removes the request event listener from the driver.
   */
  #turnDriverOff() {
    this.#driver.removeEventListener(
      "request",
      this.#requestHandler
    );
  }
  /**
   * Processes a request and returns the response.
   * @param {HyperAPIRequest} request The HyperAPI request.
   * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
   */
  async #handleRequest(request) {
    try {
      const response_data = await this.#useModule(request);
      return new HyperAPIResponse(
        request,
        response_data
      );
    } catch (error) {
      if (error instanceof HyperAPIError !== true) {
        console.error(error);
        error = new HyperAPIInternalError();
      }
      return new HyperAPIResponse(
        request,
        error
      );
    }
  }
  /**
   * Processes a request and returns the response.
   * @param {HyperAPIRequest} request The HyperAPI request.
   * @returns {Promise<HyperAPIModule>} The HyperAPI response.
   */
  async #getModule(request) {
    const filenames = [
      request.module_path,
      `${request.module_path}.js`,
      `${request.module_path}.mjs`,
      `${request.module_path}.cjs`,
      (0, import_node_path2.join)(request.module_path, "index.js")
    ];
    for (const filename of filenames) {
      const path = (0, import_node_path2.join)(
        this.#root,
        filename
      );
      try {
        return await import(path);
      } catch (error) {
        if (error.code === "ERR_MODULE_NOT_FOUND") {
          const path_not_found = extractModuleNotFoundPath(error);
          if (path === path_not_found) {
            continue;
          }
        }
        if (error instanceof Error && error.message.startsWith(`Failed to load url ${path} `)) {
          continue;
        }
        throw error;
      }
    }
    throw new HyperAPIUnknownMethodError();
  }
  /**
   * Processes a request and returns the response.
   * @param {HyperAPIRequest} request The HyperAPI request.
   * @returns {Promise<HyperAPIModuleResponse>} The HyperAPI response.
   */
  async #useModule(request) {
    const module2 = await this.#getModule(request);
    if (typeof module2.argsValidator === "function") {
      request.args = await module2.argsValidator(request.args);
    }
    return module2.default(request);
  }
  /**
   * Destroys the HyperAPI instance.
   */
  destroy() {
    this.#turnDriverOff();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HyperAPI,
  HyperAPIAuthorizationError,
  HyperAPIBusyError,
  HyperAPICaptchaError,
  HyperAPIConfirmationError,
  HyperAPIDriver,
  HyperAPIError,
  HyperAPIForbiddenError,
  HyperAPIInternalError,
  HyperAPIInvalidParametersError,
  HyperAPIMaintenanceError,
  HyperAPIOTPError,
  HyperAPIObjectsLimitError,
  HyperAPIRateLimitError,
  HyperAPIRequest,
  HyperAPIResponse,
  HyperAPIUnknownMethodError
});
