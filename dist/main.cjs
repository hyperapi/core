"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/main.js
var main_exports = {};
__export(main_exports, {
  HyperAPI: () => HyperAPI,
  HyperAPIAuthorizationError: () => HyperAPIAuthorizationError,
  HyperAPIBusyError: () => HyperAPIBusyError,
  HyperAPICaptchaError: () => HyperAPICaptchaError,
  HyperAPIConfirmationError: () => HyperAPIConfirmationError,
  HyperAPIError: () => HyperAPIError,
  HyperAPIForbiddenError: () => HyperAPIForbiddenError,
  HyperAPIInternalError: () => HyperAPIInternalError,
  HyperAPIInvalidParametersError: () => HyperAPIInvalidParametersError,
  HyperAPIMaintenanceError: () => HyperAPIMaintenanceError,
  HyperAPIOTPError: () => HyperAPIOTPError,
  HyperAPIObjectsLimitError: () => HyperAPIObjectsLimitError,
  HyperAPIRateLimitError: () => HyperAPIRateLimitError,
  HyperAPIUnknownMethodError: () => HyperAPIUnknownMethodError
});
module.exports = __toCommonJS(main_exports);
var import_node_path2 = __toESM(require("node:path"), 1);

// dist/esm/utils/is-record.js
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";
}

// dist/esm/error.js
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
    if (isRecord(data)) {
      this.data = data;
    }
  }
  get message() {
    return `${this.description} (code ${this.code}).`;
  }
  /**
   * Creates response object.
   * @returns -
   */
  getResponse() {
    const response = {
      code: this.code
    };
    if (typeof this.description === "string") {
      response.description = this.description;
    }
    if (this.data) {
      response.data = this.data;
    }
    return response;
  }
};

// dist/esm/api-errors.js
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

// dist/esm/router.js
var import_itty_router = require("itty-router");
var import_node_fs = require("node:fs");
var import_node_path = __toESM(require("node:path"), 1);
function createRouter(path) {
  const router = (0, import_itty_router.IttyRouter)();
  scanDirectory(router, path);
  return router;
}
function useRouter(router, method, path) {
  return router.fetch({
    method,
    url: `file://${path}`
  });
}
var REGEXP_FILE_EXTENSION = /\.(js|mjs|cjs|ts)$/;
var REGEXP_HTTP_METHOD = /\.\[(delete|get|head|options|patch|post|put)]$/;
var REGEXP_PATH_SLUG = /\[(\w+)]/g;
function scanDirectory(router, path, regexp_parts = [""]) {
  const result = (0, import_node_fs.readdirSync)(path, {
    withFileTypes: true
  });
  const routes = {
    0: [],
    // routes with no method and no slug
    1: [],
    // routes with method and no slug
    2: [],
    // routes with no method and slug
    3: []
    // routes with method and slug
  };
  for (const entry of result) {
    const entry_path = import_node_path.default.join(path, entry.name);
    if (entry.isFile()) {
      let file_name = entry.name;
      if (REGEXP_FILE_EXTENSION.test(file_name)) {
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
        routes[has_method | has_slug].push({
          method,
          path: [
            ...regexp_parts,
            file_name
          ].join(import_node_path.default.sep),
          module_path: entry_path
        });
      }
    } else {
      scanDirectory(router, entry_path, [
        ...regexp_parts,
        entry.name.replaceAll(REGEXP_PATH_SLUG, ":$1")
      ]);
    }
  }
  for (const route of [
    ...routes[1],
    ...routes[3],
    ...routes[0],
    ...routes[2]
  ]) {
    router[route.method](route.path, (r) => {
      const response = {
        module_path: route.module_path,
        args: r.params
      };
      return response;
    });
  }
}

// dist/esm/main.js
var ENTRYPOINT_PATH = import_node_path2.default.dirname(process.argv[1]);
var HyperAPI = class {
  router;
  driver;
  /**
   * Creates a HyperAPI instance.
   * @param options The options.
   * @param options.driver The driver.
   * @param [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
   */
  constructor({ driver, root = import_node_path2.default.join(ENTRYPOINT_PATH, "hyper-api") }) {
    this.driver = driver;
    this.router = createRouter(root);
    this.driver.start(async (driver_request) => {
      const [request, module_, response] = await this.processRequest(driver_request);
      if (request && module_) {
        for (const hook of this.handlers.response) {
          try {
            await hook(request, module_, response);
          } catch (error) {
            console.error('Error in "response" hook:');
            console.error(error);
          }
        }
      }
      return response;
    });
  }
  handlers = {
    transformer: void 0,
    module: [],
    response: []
  };
  /**
   * Use this hook add properties to the request before it is send to the API module.
   *
   * This hook can be set only once.
   * @param transformer The callback function.
   */
  setTransformer(transformer) {
    if (this.handlers.transformer) {
      throw new Error("Transformer has already been set.");
    }
    this.handlers.transformer = transformer;
  }
  /**
   * Adds a hook to be called when the API module is imported.
   * @param callback -
   */
  onModule(callback) {
    this.handlers.module.push(callback);
  }
  /**
   * Adds a hook to be called right before the response is sent back.
   *
   * This hook called only if the request was processed by the API module. If unknown method was requested, this hook is not called.
   * @param callback -
   */
  onResponse(callback) {
    this.handlers.response.push(callback);
  }
  async processRequest(driver_request) {
    let request = null;
    let module_ = null;
    try {
      if (driver_request.path.startsWith("/") !== true) {
        driver_request.path = `/${driver_request.path}`;
      }
      const router_response = await useRouter(this.router, driver_request.method, driver_request.path);
      if (!router_response) {
        return [
          request,
          module_,
          new HyperAPIUnknownMethodError()
        ];
      }
      driver_request.args = {
        ...driver_request.args,
        ...router_response.args
      };
      request = this.handlers.transformer ? await this.handlers.transformer(driver_request) : driver_request;
      module_ = await import(router_response.module_path);
      if (module_.argsValidator) {
        request.args = module_.argsValidator(request.args);
      }
      for (const hook of this.handlers.module) {
        await hook(request, module_);
      }
      const response = await module_.default(request);
      return [
        request,
        module_,
        response
      ];
    } catch (error) {
      if (error instanceof HyperAPIError) {
        return [
          request,
          module_,
          error
        ];
      }
      console.error(error);
      return [
        request,
        module_,
        new HyperAPIInternalError()
      ];
    }
    throw new Error("Unreachable");
  }
  /** Destroys the HyperAPI instance. */
  destroy() {
    this.handlers.transformer = void 0;
    this.handlers.module.splice(0);
    this.handlers.response.splice(0);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HyperAPI,
  HyperAPIAuthorizationError,
  HyperAPIBusyError,
  HyperAPICaptchaError,
  HyperAPIConfirmationError,
  HyperAPIError,
  HyperAPIForbiddenError,
  HyperAPIInternalError,
  HyperAPIInvalidParametersError,
  HyperAPIMaintenanceError,
  HyperAPIOTPError,
  HyperAPIObjectsLimitError,
  HyperAPIRateLimitError,
  HyperAPIUnknownMethodError
});
