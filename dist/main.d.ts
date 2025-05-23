import { EmptyObject, Promisable } from "type-fest";

//#region src/utils/methods.d.ts
type HyperAPIMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "UNKNOWN";
/**
* Checks if the given value is a valid HyperAPI method.
* @param method The HTTP method to check.
* @returns -
*/
declare function isHyperApiMethod(method: unknown): method is HyperAPIMethod;

//#endregion
//#region src/request.d.ts
type HyperAPIRequestArgs = Record<string, unknown>;
interface HyperAPIRequest<A extends HyperAPIRequestArgs = EmptyObject> {
  method: HyperAPIMethod;
  path: string;
  args: A;
}

//#endregion
//#region src/error.d.ts
type HyperAPIErrorData = Record<string, unknown> | undefined;
interface HyperAPIErrorResponse {
  code: number;
  description?: string;
  data?: HyperAPIErrorData;
}
declare class HyperAPIError<D extends HyperAPIErrorData = undefined> extends Error {
  /** The error code. */
  readonly code: number;
  /** The error description. */
  readonly description: string;
  /** The error data. */
  readonly data?: D;
  /** HTTP status code. */
  readonly httpStatus?: number;
  /** HTTP headers to return. */
  readonly httpHeaders?: Record<string, string>;
  constructor(data?: D);
  get message(): string;
  /**
  * Creates response object.
  * @returns -
  */
  getResponse(): HyperAPIErrorResponse;
}

//#endregion
//#region src/module.d.ts
type HyperAPIModuleResponse = Record<string, unknown> | Response | unknown[] | undefined;
interface HyperAPIModule<R extends HyperAPIRequest<HyperAPIRequestArgs>> {
  readonly default: (request: R) => Promisable<HyperAPIModuleResponse>;
  readonly argsValidator: (args: unknown) => R extends HyperAPIRequest<infer A> ? A : never;
}
// export type HyperAPIModuleRequest<M extends HyperAPIModule<HyperAPIRequest>> = Parameters<M['default']>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferModule<H extends HyperAPI<any, any, any>> = H extends HyperAPI<infer _D, infer _R, infer M> ? M : never;

//#endregion
//#region src/response.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;

//#endregion
//#region src/driver.d.ts
type HyperAPIDriverHandler<R extends HyperAPIRequest = HyperAPIRequest> = (request: R) => Promisable<HyperAPIResponse>;
interface HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest> {
  start(handler: HyperAPIDriverHandler<R>): void;
  stop(): void;
}
type InferDriverRequest<D extends HyperAPIDriver> = D extends HyperAPIDriver<infer R extends HyperAPIRequest> ? R : never;

//#endregion
//#region src/api-errors.d.ts
declare class HyperAPIAuthorizationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIInvalidParametersError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIInternalError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIForbiddenError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIUnknownMethodError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIObjectsLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIRateLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPICaptchaError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIBusyError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIConfirmationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIOTPError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIMaintenanceError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}
declare class HyperAPIMethodNotAllowedError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  code: number;
  description: string;
  httpStatus: number;
}

//#endregion
//#region src/main.d.ts
interface HyperAPIHandlers<D extends HyperAPIDriver, R extends InferDriverRequest<D>, M extends HyperAPIModule<R>> {
  transformer: ((driver_request: Readonly<InferDriverRequest<D>>) => Promisable<R>) | void;
  module: ((request: Readonly<R>, module_: M) => Promisable<void>)[];
  response: ((request: R, module_: M, response: HyperAPIResponse) => Promisable<void>)[];
}
declare class HyperAPI<D extends HyperAPIDriver<HyperAPIRequest>, R extends InferDriverRequest<D>, M extends HyperAPIModule<R> = HyperAPIModule<R>> {
  private router;
  private driver;
  /**
  * Creates a HyperAPI instance.
  * @param options The options.
  * @param options.driver The driver.
  * @param [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
  */
  constructor({
    driver,
    root
  }: {
    driver: D;
    root?: string;
  });
  private handlers;
  /**
  * Use this hook add properties to the request before it is send to the API module.
  *
  * This hook can be set only once.
  * @param transformer The callback function.
  */
  setTransformer(transformer: HyperAPIHandlers<D, R, M>["transformer"]): void;
  /**
  * Adds a hook to be called when the API module is imported.
  * @param callback -
  */
  onModule(callback: HyperAPIHandlers<D, R, M>["module"][number]): void;
  /**
  * Adds a hook to be called right before the response is sent back.
  *
  * This hook called only if the request was processed by the API module. If unknown method was requested, this hook is not called.
  * @param callback -
  */
  onResponse(callback: HyperAPIHandlers<D, R, M>["response"][number]): void;
  private processRequest;
  /** Destroys the HyperAPI instance. */
  destroy(): void;
}

//#endregion
export { HyperAPI, HyperAPIAuthorizationError, HyperAPIBusyError, HyperAPICaptchaError, HyperAPIConfirmationError, HyperAPIDriver, HyperAPIDriverHandler, HyperAPIError, HyperAPIErrorData, HyperAPIForbiddenError, HyperAPIInternalError, HyperAPIInvalidParametersError, HyperAPIMaintenanceError, HyperAPIMethod, HyperAPIMethodNotAllowedError, HyperAPIModule, HyperAPIModuleResponse, HyperAPIOTPError, HyperAPIObjectsLimitError, HyperAPIRateLimitError, HyperAPIRequest, HyperAPIRequestArgs, HyperAPIResponse, HyperAPIUnknownMethodError, InferModule, isHyperApiMethod };