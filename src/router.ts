import { type IRequest, IttyRouter, type IttyRouterType } from 'itty-router';
import type { HyperAPIModule } from './module.js';
import type { HyperAPIRequest } from './request.js';
import { readFiles, type WalkResult } from './router/file-tree.js';
import type { HyperAPIMethod } from './utils/methods.js';
import type { BaseRecord } from './utils/record.js';

type HyperAPIIttyRouterResponse = {
	getHandler: () => Promise<HyperAPIModule<HyperAPIRequest<BaseRecord>>>;
	path: string;
	args: BaseRecord;
};
type HyperAPIIttyRouter = IttyRouterType<
	IRequest,
	[],
	HyperAPIIttyRouterResponse
>;

/**
 * Creates new IttyRouter from filesystem.
 * @param path_root The path to scan.
 * @returns The new IttyRouter.
 */
export function createRouter(path_root: string): HyperAPIIttyRouter {
	// eslint-disable-next-line new-cap
	const router: HyperAPIIttyRouter = IttyRouter();

	const routes = readFiles(path_root);
	// console.log(Bun.inspect(routes, { colors: true }));

	fillRouter(routes, router);

	return router;
}

/**
 * Attaches routes to IttyRouter.
 * @param routes The routes to attach.
 * @param router The IttyRouter to attach to.
 */
function fillRouter(routes: WalkResult, router: HyperAPIIttyRouter) {
	for (const route of routes) {
		if ('method' in route) {
			// console.log('[fillRouter]', route.method, route.route);
			router[route.method](
				route.route,
				(request) =>
					({
						async getHandler() {
							const module_ = await import(route.path);
							return module_.default;
						},
						path: route.path,
						args: request.params,
					}) as HyperAPIIttyRouterResponse,
			);
		} else if ('children' in route) {
			fillRouter(route.children, router);
		}
	}
}

/**
 * Fetches data from router.
 * @param router The router to fetch data from.
 * @param method The HTTP method.
 * @param path The path to fetch data from.
 * @returns The response.
 */
export async function useRouter(
	router: HyperAPIIttyRouter,
	method: HyperAPIMethod,
	path: string,
): Promise<HyperAPIIttyRouterResponse | 'INVALID' | 'NOT_EXISTS'> {
	// console.log('[useRouter]', method, path);
	const url = `file://${path}`;
	const result = await router.fetch({
		method,
		url,
	});

	if (result) {
		// console.log('result', result);
		return result;
	}

	const result_unknown = await router.fetch({
		method: 'UNKNOWN',
		url,
	});

	return result_unknown ? 'INVALID' : 'NOT_EXISTS';
}
