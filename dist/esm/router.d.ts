import { type IRequest, type IttyRouterType } from 'itty-router';
import { HyperAPIMethod } from './utils/methods.js';
/**
 * Creates new IttyRouter from filesystem.
 * @param path The path to scan.
 * @returns The new IttyRouter.
 */
export declare function createRouter(path: string): IttyRouterType<IRequest, any[], any>;
interface RouterResponse {
    module_path: string;
    args: Record<string, unknown>;
}
/**
 * Fetches data from router.
 * @param router The router to fetch data from.
 * @param method The HTTP method.
 * @param path The path to fetch data from.
 * @returns The response.
 */
export declare function useRouter(router: IttyRouterType<IRequest, unknown[], unknown>, method: HyperAPIMethod, path: string): Promise<RouterResponse | undefined>;
export {};
