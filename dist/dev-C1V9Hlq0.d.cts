import { EmptyObject, EmptyObject as EmptyObject$1, Merge, Promisable, UnknownRecord, UnknownRecord as UnknownRecord$1 } from "type-fest";
import { NeoEvent, NeoEventTarget } from "neoevents";

//#region src/utils/methods.d.ts
type HyperAPIMethod = "DELETE" | "GET" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "UNDEF";
/**
* Checks if the given value is a valid HyperAPI method.
* @param method The HTTP method to check.
* @returns -
*/
declare function isHyperApiMethod(method: unknown): method is HyperAPIMethod;
//#endregion
//#region src/request.d.ts
type HyperAPIRequestArgs = UnknownRecord;
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
  constructor(data?: D, httpHeaders?: Record<string, string>);
  override get message(): string;
  /**
  * Creates response object.
  * @returns -
  */
  getResponse(): HyperAPIErrorResponse;
}
//#endregion
//#region src/module.d.ts
type HyperAPIModuleResponse = Response | UnknownRecord | unknown[] | undefined;
declare class HyperAPIModule<Req extends HyperAPIRequest<UnknownRecord>, ReqExtra extends UnknownRecord = EmptyObject> {
  private chain;
  use<ReqAdd extends UnknownRecord | void>(fn: (request: Merge<Req, ReqExtra>) => Promisable<ReqAdd>): HyperAPIModule<Req, ReqExtra & ReqAdd>;
  set<const K extends string, V>(key: K, fn: (request: Merge<Req, ReqExtra>) => Promisable<V>): HyperAPIModule<Req, ReqExtra & Record<K, V>>;
  set<const K extends string, V>(key: K, value: V): HyperAPIModule<Req, ReqExtra & Record<K, V>>;
  action<Resp extends HyperAPIModuleResponse | void>(fn: (request: Merge<Req, ReqExtra>) => Promisable<Resp>): HyperAPIModule<Req, ReqExtra & {
    response: Resp;
  }>;
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
  fetch(request: R): Promise<HyperAPIResponse>;
}
//#endregion
//#region src/router.d.ts
type HyperAPIRouteData = {
  method: HyperAPIMethod;
  route: string;
  file_path: string;
};
//#endregion
//#region src/router/file-tree.d.ts
/**
* Returns the routes for the given path.
* @param path The path to read files from.
* @returns The routes for the given path.
*/
declare function getRoutes(path: string): HyperAPIRouteData[];
//#endregion
//#region src/utils/record.d.ts
/** Check if a value is a record. */
declare function isRecord(value: unknown): value is UnknownRecord;
//#endregion
export { HyperAPIDriver as a, HyperAPIModuleResponse as c, HyperAPIRequest as d, HyperAPIRequestArgs as f, getRoutes as i, HyperAPIError as l, isHyperApiMethod as m, UnknownRecord$1 as n, HyperAPIResponse as o, HyperAPIMethod as p, isRecord as r, HyperAPIModule as s, EmptyObject$1 as t, HyperAPIErrorData as u };