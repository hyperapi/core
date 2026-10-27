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
//#region src/module.d.ts
/**
* What every transport can carry back.
*
* This is the floor: drivers whose transport can carry more pass their own
* response type to `HyperAPIDriver` instead of widening this.
*/
type HyperAPIModuleResponse = UnknownRecord | unknown[] | undefined;
declare class HyperAPIModule<Req extends HyperAPIRequest<UnknownRecord>, ReqExtra extends UnknownRecord = EmptyObject, Resp = HyperAPIModuleResponse> {
  private chain;
  use<ReqAdd extends UnknownRecord | void>(fn: (request: Merge<Req, ReqExtra>) => Promisable<ReqAdd>): HyperAPIModule<Req, ReqExtra & ReqAdd, Resp>;
  set<const K extends string, V>(key: K, fn: (request: Merge<Req, ReqExtra>) => Promisable<V>): HyperAPIModule<Req, ReqExtra & Record<K, V>, Resp>;
  set<const K extends string, V>(key: K, value: V): HyperAPIModule<Req, ReqExtra & Record<K, V>, Resp>;
  /** Constrained to what the driver this module came from can carry back. */
  action<R extends Resp | void>(fn: (request: Merge<Req, ReqExtra>) => Promisable<R>): HyperAPIModule<Req, ReqExtra & {
    response: R;
  }, Resp>;
}
//#endregion
//#region src/error.d.ts
type HeadersInit = Exclude<ConstructorParameters<typeof Headers>[0], undefined>;
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
  readonly httpStatus: number;
  /** HTTP headers to return. */
  readonly httpHeaders: Headers;
  constructor(data?: D, httpHeaders?: HeadersInit);
  override get message(): string;
  /**
  * Creates response object.
  * @returns -
  */
  getResponse(): HyperAPIErrorResponse;
}
//#endregion
//#region src/response.d.ts
/** What a driver gets back from the core: a module response, or an error. */
type HyperAPIResponse<Resp = HyperAPIModuleResponse> = Resp | HyperAPIError<any>;
//#endregion
//#region src/driver.d.ts
declare class HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest, Resp = HyperAPIModuleResponse> extends NeoEventTarget<{
  request: NeoEvent<{
    request: R;
    callback: (response: HyperAPIResponse<Resp>) => void;
  }>;
}> {
  /**
  * Runtime counterpart of the `Resp` type argument. Drivers whose transport
  * carries more than plain JSON override this to accept it:
  *
  * ```ts
  * override isValidResponse(response: unknown): response is MyResponse {
  * 	return response instanceof Response || super.isValidResponse(response);
  * }
  * ```
  *
  * Keep the override and `Resp` in sync: TypeScript cannot check that the
  * predicate matches the type it claims to narrow to.
  * @param response - The value a module returned.
  * @returns -
  */
  isValidResponse(response: unknown): response is Resp;
  fetch(request: R): Promise<HyperAPIResponse<Resp>>;
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
export { HyperAPIDriver as a, HyperAPIErrorData as c, HyperAPIRequest as d, HyperAPIRequestArgs as f, getRoutes as i, HyperAPIModule as l, isHyperApiMethod as m, UnknownRecord$1 as n, HyperAPIResponse as o, HyperAPIMethod as p, isRecord as r, HyperAPIError as s, EmptyObject$1 as t, HyperAPIModuleResponse as u };