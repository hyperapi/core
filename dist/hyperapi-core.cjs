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
   * @type {{[key: string]: *}?}
   * @readonly
   */
  data = null;
  /**
   * @param {{[key: string]: *}?} data The error data. Cannot contain "code" or "description" properties.
   */
  constructor(data = null) {
    super();
    if (data !== null && typeof data !== "object") {
      throw new TypeError("Argument 0 must be an object or not be provided");
    }
    if (data && ("code" in data || "description" in data)) {
      throw new TypeError('Argument 0 must not contain "code" or "description" properties');
    }
    this.data = data;
  }
  get message() {
    return `${this.description ?? ""} (code ${this.code})`;
  }
  getResponse() {
    const result = {
      code: this.code
    };
    if (typeof this.description === "string") {
      result.description = this.description;
    }
    return {
      ...result,
      ...this.data
    };
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
var import_node_path = require("node:path");
var HyperAPIRequest = class extends Event {
  #data = /* @__PURE__ */ new Map();
  /**
   * @param {string} module_path The relative path to the API method module.
   * @param {Array<*>} args The arguments to pass to the API method.
   */
  constructor(module_path, args) {
    super("HyperAPIRequest");
    this.module_path = module_path;
    this.args = args;
    this.flags = {};
  }
  /**
   * @param {*} key The key to get.
   * @returns {*} The value.
   */
  get(key) {
    return this.#data.get(key);
  }
  /**
   * @param {*} key The key to set.
   * @param {*} value The value to set.
   */
  set(key, value) {
    this.#data.set(key, value);
  }
  async _getModule(root) {
    const filenames = [
      this.module_path,
      `${this.module_path}.js`,
      `${this.module_path}.mjs`,
      `${this.module_path}.cjs`,
      (0, import_node_path.join)(this.module_path, "index.js")
    ];
    for (const filename of filenames) {
      try {
        return await import((0, import_node_path.join)(
          root,
          filename
        ));
      } catch {
      }
    }
    throw new HyperAPIUnknownMethodError();
  }
  #resolve;
  #promise = new Promise((resolve) => {
    this.#resolve = resolve;
  });
  /**
   * @returns {Promise<HyperAPIResponse>} The response.
   */
  wait() {
    return this.#promise;
  }
  /**
   * @param {HyperAPIResponse} response The response.
   */
  _respondWith(response) {
    this.#resolve(response);
  }
};

// src/driver.js
var HyperAPIDriver = class extends EventTarget {
  /**
   * Processes a request and waits for the response.
   * @async
   * @param {HyperAPIRequest} request The HyperAPI request.
   * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
   */
  onRequest(request) {
    if (request instanceof HyperAPIRequest !== true) {
      throw new TypeError("Argument 0 must be an instance of HyperAPIRequest.");
    }
    this.dispatchEvent(request);
    return request.wait();
  }
};

// src/response.js
var HyperAPIResponse = class {
  /**
   * Creates a HyperAPI response.
   * @param {HyperAPIError|object|Array} value The error or the response value.
   */
  constructor(value) {
    if (value instanceof HyperAPIError) {
      this.error = value;
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

// src/main.js
var HyperAPI = class {
  #driver;
  #root;
  #turnDriverOff;
  /**
   * Creates a HyperAPI instance.
   * @param {object} options The options.
   * @param {HyperAPIDriver} options.driver The HyperAPI driver.
   * @param {string=} options.root The root directory for API methods modules. Defaults to "/hyper-api" inside the current working directory.
   */
  constructor({
    driver,
    root = (0, import_node_path2.join)(
      process.cwd(),
      "hyper-api"
    )
  }) {
    if (driver instanceof HyperAPIDriver !== true) {
      throw new TypeError('Property "driver" must be an instance of HyperAPIDriver.');
    }
    this.#driver = driver;
    this.#root = root;
    this.#setUpListener();
  }
  #setUpListener() {
    const handler = async (request) => {
      try {
        request._respondWith(
          await this.#handleRequest(request)
        );
      } catch (error) {
        console.error("Unexpected error happened:");
        console.error(error);
        process.exit();
      }
    };
    this.#driver.addEventListener(
      "HyperAPIRequest",
      handler
    );
    this.#turnDriverOff = () => {
      this.#driver.removeEventListener(
        "HyperAPIRequest",
        handler
      );
    };
  }
  /**
   * Processes a request and returns the response.
   * @param {HyperAPIRequest} request The HyperAPI request.
   * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
   */
  async #handleRequest(request) {
    try {
      const response = await this.#useModule(request);
      return new HyperAPIResponse(response);
    } catch (error) {
      if (error instanceof HyperAPIError !== true) {
        console.error(error);
        error = new HyperAPIInternalError();
      }
      return new HyperAPIResponse(error);
    }
  }
  async #useModule(request) {
    const module2 = await request._getModule(this.#root);
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
