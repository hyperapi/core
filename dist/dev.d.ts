import { c as HyperAPIErrorData, d as BaseRecord, f as EmptyObject, h as isHyperApiMethod, i as HyperAPIModuleResponse, l as HyperAPIRequest, m as HyperAPIMethod, n as HyperAPIResponse, p as isRecord, r as HyperAPIModule, t as HyperAPIDriver, u as HyperAPIRequestArgs } from "./driver-CqzRTtaR.js";

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
export { type BaseRecord, type EmptyObject, HyperAPIDriver, type HyperAPIErrorData, type HyperAPIMethod, type HyperAPIModule, type HyperAPIModuleResponse, type HyperAPIRequest, type HyperAPIRequestArgs, type HyperAPIResponse, getRoutes, isHyperApiMethod, isRecord };