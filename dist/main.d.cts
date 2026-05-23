import { a as Extend, c as HyperAPIErrorData, d as BaseRecord, f as EmptyObject, l as HyperAPIRequest, n as HyperAPIResponse, o as Join, r as HyperAPIModule, s as HyperAPIError, t as HyperAPIDriver } from "./driver-D6UYcSS8.cjs";
import { Promisable } from "type-fest";

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
declare class HyperAPIMethodNotAllowedError extends HyperAPIError {
  code: number;
  description: string;
  httpStatus: number;
  constructor(allowed_methods: string[]);
}
//#endregion
//#region src/main.d.ts
declare class HyperAPI<Req extends HyperAPIRequest, ReqExtra extends BaseRecord = EmptyObject> {
  #private;
  private off;
  constructor(driver: HyperAPIDriver<Req>, root?: string);
  private hooks_before_router;
  onBeforeRouter<ReqAdd extends BaseRecord | void>(fn: (request: Join<Req, ReqExtra>) => Promisable<ReqAdd>): HyperAPI<Req, Extend<ReqExtra, ReqAdd>>;
  private hooks_response;
  onResponse(fn: (request: Join<Req, Extend<ReqExtra, {
    response: HyperAPIResponse;
  }>>) => Promisable<void>): HyperAPI<Req, ReqExtra>;
  private processRequest;
  module(): HyperAPIModule<Req, ReqExtra>;
  destroy(): void;
}
//#endregion
export { HyperAPI, HyperAPIAuthorizationError, HyperAPIBusyError, HyperAPICaptchaError, HyperAPIConfirmationError, HyperAPIError, HyperAPIForbiddenError, HyperAPIInternalError, HyperAPIInvalidParametersError, HyperAPIMaintenanceError, HyperAPIMethodNotAllowedError, HyperAPIOTPError, HyperAPIObjectsLimitError, HyperAPIRateLimitError, HyperAPIUnknownMethodError };