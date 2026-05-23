// oxlint-disable typescript/no-invalid-void-type

import nodePath from 'node:path';
import type { Promisable } from 'type-fest';
import {
	HyperAPIInternalError,
	HyperAPIInvalidParametersError,
} from './api-errors.js';
import type { HyperAPIDriver } from './driver.js';
import { HyperAPIError } from './error.js';
import { HyperAPIModule } from './module.js';
import type { HyperAPIRequest } from './request.js';
import { type HyperAPIResponse, isHyperAPIResponse } from './response.js';
import { HyperAPIRouter } from './router.js';
import {
	type BaseRecord,
	type EmptyObject,
	hasCommonKeys,
} from './utils/record.js';
import type { Extend, Join } from './utils/types.js';

const ENTRYPOINT_PATH = nodePath.dirname(process.argv[1]!);

export class HyperAPI<
	Req extends HyperAPIRequest,
	ReqExtra extends BaseRecord = EmptyObject,
> {
	#router;
	private off: () => void;

	constructor(
		driver: HyperAPIDriver<Req>,
		root: string = nodePath.join(ENTRYPOINT_PATH, 'hyper-api'),
	) {
		this.#router = new HyperAPIRouter(root);

		this.off = driver.on('request', async (event) => {
			const [request_external, response] = await this.processRequest(
				event.detail.request,
			);

			if (this.hooks_response.length > 0) {
				const promises = [];
				for (const fn of this.hooks_response) {
					// catch sync errors
					try {
						const result = fn({
							...event.detail.request,
							...request_external,
							response,
						});

						if (result instanceof Promise) {
							// oxlint-disable-next-line no-console
							promises.push(result.catch(console.error));
						}
					} catch (error) {
						// oxlint-disable-next-line no-console
						console.error(error);
					}
				}

				await Promise.all(promises);
			}

			event.detail.callback(response);
		});
	}

	private hooks_before_router: ((
		request: Join<Req, ReqExtra>,
	) => Promisable<BaseRecord | void>)[] = [];

	onBeforeRouter<ReqAdd extends BaseRecord | void>(
		fn: (request: Join<Req, ReqExtra>) => Promisable<ReqAdd>,
	) {
		this.hooks_before_router.push(fn);

		return this as unknown as HyperAPI<Req, Extend<ReqExtra, ReqAdd>>;
	}

	private hooks_response: Parameters<typeof this.onResponse>[0][] = [];

	onResponse(
		fn: (
			request: Join<Req, Extend<ReqExtra, { response: HyperAPIResponse }>>,
		) => Promisable<void>,
	) {
		this.hooks_response.push(fn);

		return this as HyperAPI<Req, ReqExtra>;
	}

	private async processRequest(
		request: Req,
	): Promise<[ReqExtra, HyperAPIResponse]> {
		// 1. *Driver* creates a request and passes it to the *Core*

		// console.log('Processing request:', request);

		const request_external = {} as ReqExtra;

		try {
			if (request.path.startsWith('/') !== true) {
				request.path = `/${request.path}`;
			}

			// 2. *Core* executes all registered `onBeforeRouter` hooks...
			for (const fn of this.hooks_before_router) {
				// oxlint-disable-next-line no-await-in-loop
				const request_added = await fn({
					...request,
					...request_external,
				});
				if (request_added !== undefined) {
					Object.assign(request_external, request_added);
				}
			}

			// 3. *Core* uses a file router...
			const router_response = await this.#router.fetch(
				request.method,
				request.path,
			);

			// 4. *Core* merges arguments received from the driver with arguments extracted from the request path by the file router
			if (hasCommonKeys(router_response.args, request.args)) {
				throw new HyperAPIInvalidParametersError();
			}

			request.args = {
				...request.args,
				...router_response.args,
			} as Req['args'];

			// 5. *Core* imports the matched module file...
			const handler = await router_response.getHandler();
			if (handler === undefined) {
				// oxlint-disable-next-line no-console
				console.error(
					`There is no handler in ${router_response.route_data.file_path}. Did you forget "export default" in the module?`,
				);
				throw new HyperAPIInternalError();
			}

			// 6. *Core* calls the module
			const { response } = await handler._run({
				...request,
				...request_external,
			});
			if (isHyperAPIResponse(response) !== true) {
				throw new TypeError(
					`Invalid response type from module ${router_response.route_data.file_path}. Expected Response, HyperAPIError, array, object or undefined.`,
				);
			}

			return [request_external, response];
		} catch (error) {
			if (error instanceof HyperAPIError) {
				return [request_external, error];
			}

			// oxlint-disable-next-line no-console
			console.error(error);

			return [request_external, new HyperAPIInternalError()];
		}
	}

	// oxlint-disable-next-line class-methods-use-this
	module(): HyperAPIModule<Req, ReqExtra> {
		return new HyperAPIModule<Req, ReqExtra>();
	}

	destroy(): void {
		this.off();
	}
}

export * from './api-errors.js';
export { HyperAPIError } from './error.js';
