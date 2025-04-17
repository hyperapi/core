var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// dist/esm/main.js
var exports_main = {};
__export(exports_main, {
  isHyperApiMethod: () => isHyperApiMethod,
  HyperAPIUnknownMethodError: () => HyperAPIUnknownMethodError,
  HyperAPIRateLimitError: () => HyperAPIRateLimitError,
  HyperAPIObjectsLimitError: () => HyperAPIObjectsLimitError,
  HyperAPIOTPError: () => HyperAPIOTPError,
  HyperAPIMethodNotAllowedError: () => HyperAPIMethodNotAllowedError,
  HyperAPIMaintenanceError: () => HyperAPIMaintenanceError,
  HyperAPIInvalidParametersError: () => HyperAPIInvalidParametersError,
  HyperAPIInternalError: () => HyperAPIInternalError,
  HyperAPIForbiddenError: () => HyperAPIForbiddenError,
  HyperAPIError: () => HyperAPIError,
  HyperAPIConfirmationError: () => HyperAPIConfirmationError,
  HyperAPICaptchaError: () => HyperAPICaptchaError,
  HyperAPIBusyError: () => HyperAPIBusyError,
  HyperAPIAuthorizationError: () => HyperAPIAuthorizationError,
  HyperAPI: () => HyperAPI
});
module.exports = __toCommonJS(exports_main);
var import_node_path2 = __toESM(require("node:path"));

// dist/esm/utils/is-record.js
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";
}

// dist/esm/error.js
class HyperAPIError extends Error {
  code = 0;
  description = "HyperAPI error";
  data;
  httpStatus;
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
}

// dist/esm/api-errors.js
class HyperAPIAuthorizationError extends HyperAPIError {
  code = 1;
  description = "Authorization error";
  httpStatus = 401;
}

class HyperAPIInvalidParametersError extends HyperAPIError {
  code = 2;
  description = "One of the parameters specified was missing or invalid";
  httpStatus = 400;
}

class HyperAPIInternalError extends HyperAPIError {
  code = 3;
  description = "Internal error";
  httpStatus = 500;
}

class HyperAPIForbiddenError extends HyperAPIError {
  code = 4;
  description = "You do not have permission to perform this action";
  httpStatus = 403;
}

class HyperAPIUnknownMethodError extends HyperAPIError {
  code = 5;
  description = "Unknown method called";
  httpStatus = 404;
}

class HyperAPIObjectsLimitError extends HyperAPIError {
  code = 6;
  description = "Too many objects requested";
  httpStatus = 400;
}

class HyperAPIRateLimitError extends HyperAPIError {
  code = 7;
  description = "Rate limit exceeded";
  httpStatus = 429;
}

class HyperAPICaptchaError extends HyperAPIError {
  code = 8;
  description = "Captcha required";
  httpStatus = 428;
}

class HyperAPIBusyError extends HyperAPIError {
  code = 10;
  description = "Endpoint is busy";
  httpStatus = 503;
}

class HyperAPIConfirmationError extends HyperAPIError {
  code = 11;
  description = "Confirmation required";
  httpStatus = 409;
}

class HyperAPIOTPError extends HyperAPIError {
  code = 12;
  description = "One-time password required";
  httpStatus = 401;
}

class HyperAPIMaintenanceError extends HyperAPIError {
  code = 13;
  description = "Endpoint is in maintenance mode";
  httpStatus = 503;
}

class HyperAPIMethodNotAllowedError extends HyperAPIError {
  code = 14;
  description = "HTTP method not allowed";
  httpStatus = 405;
}

// dist/esm/router.js
var import_itty_router = require("itty-router");
var import_node_fs = require("node:fs");
var import_node_path = __toESM(require("node:path"));
function createRouter(path) {
  const router = import_itty_router.IttyRouter();
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
var REGEXP_TEST_FILE_EXTENSION = /\.test\.(js|mjs|cjs|ts)$/;
var REGEXP_HTTP_METHOD = /\.\[(delete|get|head|options|patch|post|put)]$/;
var REGEXP_PATH_SLUG = /\[(\w+)]/g;
function scanDirectory(router, path, regexp_parts = [""]) {
  const result = import_node_fs.readdirSync(path, {
    withFileTypes: true
  });
  const routes = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  for (const entry of result) {
    const entry_path = import_node_path.default.join(path, entry.name);
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
// dist/esm/utils/methods.js
function isHyperApiMethod(method) {
  return method === "DELETE" || method === "GET" || method === "HEAD" || method === "OPTIONS" || method === "PATCH" || method === "POST" || method === "PUT" || method === "UNKNOWN";
}

// dist/esm/main.js
var ENTRYPOINT_PATH = import_node_path2.default.dirname(process.argv[1]);

class HyperAPI {
  router;
  driver;
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
    transformer: undefined,
    module: [],
    response: []
  };
  setTransformer(transformer) {
    if (this.handlers.transformer) {
      throw new Error("Transformer has already been set.");
    }
    this.handlers.transformer = transformer;
  }
  onModule(callback) {
    this.handlers.module.push(callback);
  }
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
        throw new HyperAPIUnknownMethodError;
      }
      driver_request.args = {
        ...driver_request.args,
        ...router_response.args
      };
      request = this.handlers.transformer ? await this.handlers.transformer(driver_request) : driver_request;
      module_ = await import(router_response.module_path);
      if (module_.argsValidator) {
        try {
          request.args = module_.argsValidator(request.args);
        } catch (error) {
          console.error(error);
          throw new HyperAPIInvalidParametersError;
        }
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
        new HyperAPIInternalError
      ];
    }
    throw new Error("Unreachable");
  }
  destroy() {
    this.handlers.transformer = undefined;
    this.handlers.module.splice(0);
    this.handlers.response.splice(0);
  }
}
