import { IsEqual, Promisable, Simplify } from "type-fest";
import { NeoEvent, NeoEventTarget } from "neoevents";

//#region src/utils/methods.d.ts
type HyperAPIMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "UNKNOWN";
/**
* Checks if the given value is a valid HyperAPI method.
* @param method The HTTP method to check.
* @returns -
*/
declare function isHyperApiMethod(method: unknown): method is HyperAPIMethod;
//#endregion
//#region src/utils/record.d.ts
type BaseRecord = Record<string | number | symbol, unknown>;
type EmptyObject = Record<symbol, never>;
/**
* Check if a value is a record.
* @param value -
* @returns -
*/
//#endregion
//#region src/request.d.ts
type HyperAPIRequestArgs = BaseRecord;
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
//#region src/utils/types.d.ts
type Join<R extends HyperAPIRequest<BaseRecord>, ReqExtra extends BaseRecord> = R & ([ReqExtra] extends [never] ? unknown : IsEqual<ReqExtra, EmptyObject> extends true ? unknown : ReqExtra);
type Extend<V1 extends BaseRecord, V2 extends BaseRecord | void> = Simplify<V2 extends void ? V1 : ([V1] extends [never] ? unknown : IsEqual<V1, EmptyObject> extends true ? unknown : V1) & V2>;
//#endregion
//#region src/module.d.ts
type HyperAPIModuleResponse = Response | BaseRecord | unknown[] | undefined;
declare class HyperAPIModule<Req extends HyperAPIRequest<BaseRecord>, ReqExtra extends BaseRecord = never> {
  private chain;
  use<ReqAdd extends BaseRecord | void>(fn: (request: Join<Req, ReqExtra>) => Promisable<ReqAdd>): HyperAPIModule<Req, Extend<ReqExtra, ReqAdd>>;
  set<const K extends string, V>(key: K, fn: (request: Join<Req, ReqExtra>) => Promisable<V>): HyperAPIModule<Req, Extend<ReqExtra, { [I in K]: V }>>;
  set<const K extends string, V>(key: K, value: V): HyperAPIModule<Req, Extend<ReqExtra, { [I in K]: V }>>;
  action<Resp extends HyperAPIModuleResponse | void>(fn: (request: Join<Req, ReqExtra>) => Promisable<Resp>): HyperAPIModule<Req, Extend<ReqExtra, {
    response: Resp;
  }>>;
  _run(request: Req): Promise<Join<Join<Req, {
    response?: unknown;
  }>, ReqExtra>>;
}
//#endregion
//#region src/response.d.ts
type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
/**
* Checks if the given value is a HyperAPIResponse.
* @param response - The value to check.
* @returns True if the value is a HyperAPIResponse, false otherwise.
*/
//#endregion
//#region src/driver.d.ts
declare class HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest> extends NeoEventTarget<{
  request: NeoEvent<{
    request: R;
    callback: (response: HyperAPIResponse) => void;
  }>;
}> {
  R: R;
}
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
declare class HyperAPIUnknownMethodNotAllowedError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
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
declare class HyperAPI<Req extends HyperAPIRequest, ReqExtra extends BaseRecord = EmptyObject> {
  private router;
  private off;
  constructor(driver: HyperAPIDriver<Req>, root?: string);
  private hooks_before_router;
  onBeforeRouter<ReqAdd extends BaseRecord | void>(fn: (request: Join<Req, ReqExtra>) => Promisable<ReqAdd>): HyperAPI<Req, Extend<ReqExtra, ReqAdd>>;
  private hooks_response;
  onResponse(fn: (request: Join<Req, ReqExtra>) => Promisable<void>): HyperAPI<Req, ReqExtra>;
  private processRequest;
  module(): HyperAPIModule<Req, ReqExtra>;
  destroy(): void;
}
//#endregion
export { HyperAPI, HyperAPIAuthorizationError, HyperAPIBusyError, HyperAPICaptchaError, HyperAPIConfirmationError, HyperAPIDriver, HyperAPIError, type HyperAPIErrorData, HyperAPIForbiddenError, HyperAPIInternalError, HyperAPIInvalidParametersError, HyperAPIMaintenanceError, type HyperAPIMethod, HyperAPIMethodNotAllowedError, type HyperAPIModule, type HyperAPIModuleResponse, HyperAPIOTPError, HyperAPIObjectsLimitError, HyperAPIRateLimitError, type HyperAPIRequest, type HyperAPIRequestArgs, type HyperAPIResponse, HyperAPIUnknownMethodError, HyperAPIUnknownMethodNotAllowedError, isHyperApiMethod };