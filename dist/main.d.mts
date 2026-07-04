import { a as HyperAPIDriver, d as HyperAPIRequest, l as HyperAPIError, o as HyperAPIResponse, p as HyperAPIMethod, s as HyperAPIModule, u as HyperAPIErrorData } from "./dev-B88aXDMx.mjs";
import { EmptyObject, Promisable, UnknownRecord } from "type-fest";

//#region src/api-errors.d.ts
declare class HyperAPIAuthorizationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIInvalidParametersError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIInternalError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIForbiddenError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIUnknownMethodError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIObjectsLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIRateLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPICaptchaError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIBusyError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIConfirmationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIOTPError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIMaintenanceError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
  override code: number;
  override description: string;
  override httpStatus: number;
}
declare class HyperAPIMethodNotAllowedError extends HyperAPIError {
  override code: number;
  override description: string;
  override httpStatus: number;
  constructor(allowed_methods: HyperAPIMethod[]);
}
//#endregion
//#region src/main.d.ts
declare class HyperAPI<Req extends HyperAPIRequest, ReqExtra extends UnknownRecord = EmptyObject> {
  #private;
  private off;
  constructor(driver: HyperAPIDriver<Req>, root?: string);
  private hooks_before_router;
  onBeforeRouter<ReqAdd extends UnknownRecord | void>(fn: (request: Req & ReqExtra) => Promisable<ReqAdd>): HyperAPI<Req, ReqExtra & ReqAdd>;
  private hooks_response;
  onResponse(fn: (request: Req & ReqExtra & {
    response: HyperAPIResponse;
  }) => Promisable<void>): HyperAPI<Req, ReqExtra>;
  private processRequest;
  module(): HyperAPIModule<Req, ReqExtra>;
  destroy(): void;
}
//#endregion
export { HyperAPI, HyperAPIAuthorizationError, HyperAPIBusyError, HyperAPICaptchaError, HyperAPIConfirmationError, HyperAPIError, HyperAPIForbiddenError, HyperAPIInternalError, HyperAPIInvalidParametersError, HyperAPIMaintenanceError, HyperAPIMethodNotAllowedError, HyperAPIOTPError, HyperAPIObjectsLimitError, HyperAPIRateLimitError, HyperAPIUnknownMethodError };