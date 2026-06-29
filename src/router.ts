import { type IRequest, IttyRouter, type IttyRouterType } from 'itty-router';
import type { UnknownRecord } from 'type-fest';
import {
	HyperAPIMethodNotAllowedError,
	HyperAPIUnknownMethodError,
} from './api-errors.js';
import type { HyperAPIModule } from './module.js';
import type { HyperAPIRequest } from './request.js';
import { getRoutes } from './router/file-tree.js';
import type { HyperAPIMethod } from './utils/methods.js';

export type HyperAPIRouteData = {
	method: HyperAPIMethod;
	route: string;
	file_path: string;
};
type HyperAPIIttyRouterResponse = {
	route: string;
	args: UnknownRecord;
};
type HyperAPIRouterResponse = {
	getHandler: () => Promise<HyperAPIModule<HyperAPIRequest<UnknownRecord>>>;
	route_data: HyperAPIRouteData;
	args: UnknownRecord;
};

export class HyperAPIRouter {
	#router: IttyRouterType<
		IRequest,
		[],
		HyperAPIIttyRouterResponse | undefined
	> = IttyRouter();
	#routes_map = new Map<string, Map<HyperAPIMethod, HyperAPIRouterResponse>>();

	constructor(path_root: string) {
		// console.log('[HyperAPIRouter]', '----------');
		for (const route of getRoutes(path_root)) {
			// console.log('[HyperAPIRouter]', route.method, route.route);

			const router_response: HyperAPIRouterResponse = Object.freeze({
				async getHandler() {
					const module_ = await import(route.file_path);
					return module_.default;
				},
				route_data: route,
				args: {},
			});

			let methods_by_route = this.#routes_map.get(route.route);
			if (methods_by_route) {
				methods_by_route.set(route.method, router_response);
			} else {
				methods_by_route = new Map();
				// oxlint-disable-next-line unicorn/no-immediate-mutation
				methods_by_route.set(route.method, router_response);
				this.#routes_map.set(route.route, methods_by_route);
			}
		}

		// console.log('[HyperAPIRouter]', 'routes_map', this.#routes_map);

		for (const route of this.#routes_map.keys()) {
			this.#router.all(route, (request) => {
				return {
					route,
					args: request.params,
				};
			});
		}

		// console.log('[HyperAPIRouter]', '----------');
		// console.log('[HyperAPIRouter]', 'routes_map', this.#routes_map);
		// console.log('[HyperAPIRouter]', '----------');
	}

	async fetch(
		method: HyperAPIMethod,
		path: string,
	): Promise<HyperAPIRouterResponse> {
		// console.log('[useRouter]', method, path);
		const url = `file://${path}`;
		const result = await this.#router.fetch({
			method,
			url,
		});

		// if itty found a route
		if (result) {
			const route_map = this.#routes_map.get(result.route);
			if (!route_map) {
				throw new Error(
					`Internal HyperAPI error: route not found for ${result.route}.`,
				);
			}

			const router_response = route_map.get(method);
			if (!router_response) {
				throw new HyperAPIMethodNotAllowedError([...route_map.keys()]);
			}

			return {
				...router_response,
				args: result.args,
			};
		}

		throw new HyperAPIUnknownMethodError();
	}
}
