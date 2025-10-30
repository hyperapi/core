import { NeoEvent, NeoEventTarget } from "neoevents";
import { IsEqual, IsNever, Merge, Promisable } from "type-fest";

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
type BaseRecord = Record<PropertyKey, unknown>;
type EmptyObject = Record<symbol, never>;
/**
* Check if a value is a record.
* @param value -
* @returns -
*/
declare function isRecord(value: unknown): value is BaseRecord;
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
type IsRecord<T extends BaseRecord | void> = IsNever<T> extends true ? false : T extends void ? false : IsEqual<T, EmptyObject> extends true ? false : true;
type Join<R extends HyperAPIRequest<BaseRecord>, ReqExtra extends BaseRecord> = IsRecord<ReqExtra> extends true ? Merge<R, ReqExtra> : R;
type Extend<V1 extends BaseRecord, V2 extends BaseRecord | void> = IsRecord<V1> extends true ? IsRecord<V2> extends true ? Merge<V1, V2> : V1 : IsRecord<V2> extends true ? Exclude<V2, void> : EmptyObject;
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
  _run(request: Req): Promise<Join<Req, Extend<ReqExtra, {
    response?: unknown;
  }>>>;
}
//#endregion
//#region src/response.d.ts
type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
//#endregion
//#region src/driver.d.ts
declare class HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest> extends NeoEventTarget<{
  request: NeoEvent<{
    request: R;
    callback: (response: HyperAPIResponse) => void;
  }>;
}> {
  protected emitRequest(request: R): Promise<HyperAPIResponse>;
}
//#endregion
export { Extend as a, HyperAPIErrorData as c, BaseRecord as d, EmptyObject as f, isHyperApiMethod as h, HyperAPIModuleResponse as i, HyperAPIRequest as l, HyperAPIMethod as m, HyperAPIResponse as n, Join as o, isRecord as p, HyperAPIModule as r, HyperAPIError as s, HyperAPIDriver as t, HyperAPIRequestArgs as u };