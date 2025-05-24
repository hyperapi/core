import nodePath from 'node:path';
import type { Promisable } from 'type-fest';
import {
	HyperAPIInternalError,
	HyperAPIInvalidParametersError,
	HyperAPIUnknownMethodError,
} from './api-errors.js';
import type {
	HyperAPIDriver,
	InferDriverRequest,
} from './driver.js';
import { HyperAPIError } from './error.js';
import type { HyperAPIModule } from './module.js';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';
import {
	createRouter,
	useRouter,
} from './router.js';

interface HyperAPIHandlers<
	D extends HyperAPIDriver,
	R extends InferDriverRequest<D>,
	M extends HyperAPIModule<R>,
> {
	beforeRouter: ((driver_request: Readonly<InferDriverRequest<D>>) => Promisable<void>)[];
	requestTransformer: ((driver_request: Readonly<InferDriverRequest<D>>, module_: M) => Promisable<R>) | void;
	beforeExecute: ((request: Readonly<R>, module_: M) => Promisable<void>)[];
	response: ((driver_request: Readonly<InferDriverRequest<D>>, request: R | null, module_: M | null, response: HyperAPIResponse) => Promisable<void>)[];
}

const ENTRYPOINT_PATH = nodePath.dirname(process.argv[1]!);

export class HyperAPI<
	D extends HyperAPIDriver<HyperAPIRequest>,
	R extends InferDriverRequest<D>,
	M extends HyperAPIModule<R> = HyperAPIModule<R>,
> {
	private router: ReturnType<typeof createRouter>;
	private driver: D;

	/**
	 * Creates a HyperAPI instance.
	 * @param options The options.
	 * @param options.driver The driver.
	 * @param [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
	 */
	constructor({
		driver,
		root = nodePath.join(ENTRYPOINT_PATH, 'hyper-api'),
	}: {
		driver: D,
		root?: string,
	}) {
		this.driver = driver;
		this.router = createRouter(root);

		this.driver.start(async (arg0) => {
			const driver_request = arg0 as InferDriverRequest<D>;

			const [
				request,
				module_,
				response,
			] = await this.processRequest(driver_request);

			// 10. *Core* executes all registered `onResponse` hooks...
			try {
				await this.useHooks(
					this.handlers.response,
					[
						driver_request,
						request,
						module_,
						response,
					],
				);
			}
			catch (error) {
				/* eslint-disable no-console */
				console.error('Error in "response" hook:');
				console.error(error);
				/* eslint-enable no-console */
			}

			// 11. Finally, *Core* passes the response back to the *Driver*...
			return response;
		});
	}

	private handlers: HyperAPIHandlers<D, R, M> = {
		beforeRouter: [],
		requestTransformer: undefined,
		beforeExecute: [],
		response: [],
	};

	/**
	 * Adds a hook to be called before request is matched against the file router.
	 *
	 * This hook can be set multiple times. Every hook is executed simultaneously.
	 *
	 * If error is thrown in this hook, it will abort the request processing and return an error response.
	 * @param callback The callback function.
	 */
	onBeforeRouter(callback: HyperAPIHandlers<D, R, M>['beforeRouter'][number]): void {
		this.handlers.beforeRouter.push(callback);
	}

	/**
	 * Use this hook add properties to the request before it is send to the API module.
	 *
	 * This hook can be set only once.
	 *
	 * If error is thrown in this hook, it will abort the request processing and return an error response.
	 * @param transformer The callback function.
	 */
	setRequestTransformer(transformer: HyperAPIHandlers<D, R, M>['requestTransformer']): void {
		if (this.handlers.requestTransformer) {
			throw new Error('Transformer has already been set.');
		}

		this.handlers.requestTransformer = transformer;
	}

	/**
	 * Adds a hook to be called right before the API module is executed.
	 *
	 * This hook can be set multiple times. Every hook is executed simultaneously.
	 *
	 * If error is thrown in this hook, it will abort the request processing and return an error response.
	 * @param callback -
	 */
	onBeforeExecute(callback: HyperAPIHandlers<D, R, M>['beforeExecute'][number]): void {
		this.handlers.beforeExecute.push(callback);
	}

	/**
	 * Adds a hook to be called right before the response is sent back to the driver.
	 *
	 * This hook can be set multiple times. Every hook is executed simultaneously.
	 *
	 * If error is thrown in this hook, it will be printed to the console, but will not prevent response from being sent to the driver.
	 * @param callback -
	 */
	onResponse(callback: HyperAPIHandlers<D, R, M>['response'][number]): void {
		this.handlers.response.push(callback);
	}

	// eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
	private async useHooks<const H extends (...args: any[]) => void>(hooks: H[], args: Parameters<H>) {
		const promises: Promisable<void>[] = [];
		for (const hook of hooks) {
			promises.push(hook(...args));
		}

		await Promise.all(promises);
	}

	private async processRequest(driver_request: InferDriverRequest<D>): Promise<[ R | null, M | null, HyperAPIResponse ]> {
		// 1. *Driver* creates a request and passes it to the *Core*

		let request: R | null = null;
		let module_: M | null = null;

		try {
			if (driver_request.path.startsWith('/') !== true) {
				driver_request.path = `/${driver_request.path}`;
			}

			// 2. *Core* executes all registered `onBeforeRouter` hooks...
			await this.useHooks(
				this.handlers.beforeRouter,
				[ driver_request ],
			);

			// 3. *Core* uses a file router...
			const router_response = await useRouter(
				this.router,
				driver_request.method,
				driver_request.path,
			);
			if (!router_response) {
				// TODO throw HyperAPIMethodNotAllowedError when path exists but HTTP method does not match
				throw new HyperAPIUnknownMethodError();
			}

			// 4. *Core* merges arguments received from the driver with arguments extracted from the request path by the file router
			driver_request.args = {
				...driver_request.args,
				...router_response.args,
			};

			// 5. *Core* imports the matched module file...
			module_ = (await import(router_response.module_path)) as M;

			// 6. If `argsValidator` is defined, *Core* calls it to validate the request arguments...
			if (module_.argsValidator) {
				try {
					driver_request.args = module_.argsValidator(driver_request.args);
				}
				catch (error) {
					// eslint-disable-next-line no-console
					console.error(error);

					throw new HyperAPIInvalidParametersError();
				}
			}

			// 7. *Core* calls registered `setRequestTransformer` hook
			request = this.handlers.requestTransformer
				? await this.handlers.requestTransformer(driver_request, module_)
				: driver_request as R;

			// 8. *Core* executes all registered `onBeforeExecute` hooks...
			await this.useHooks(
				this.handlers.beforeExecute,
				[ request, module_ ],
			);

			// 9. *Core* calls the module's `export default function`...
			const response = await module_.default(request);

			return [
				request,
				module_,
				response,
			];
		}
		catch (error) {
			if (error instanceof HyperAPIError) {
				return [
					request,
					module_,
					error,
				];
			}

			// eslint-disable-next-line no-console
			console.error(error);

			return [
				request,
				module_,
				new HyperAPIInternalError(),
			];
		}
	}

	/** Destroys the HyperAPI instance. */
	destroy(): void {
		this.handlers.beforeRouter.splice(0);
		this.handlers.requestTransformer = undefined;
		this.handlers.beforeExecute.splice(0);
		this.handlers.response.splice(0);
	}
}

export * from './api-errors.js';
export type {
	HyperAPIDriver,
	HyperAPIDriverHandler,
} from './driver.js';
export {
	type HyperAPIErrorData,
	HyperAPIError,
} from './error.js';
export type {
	HyperAPIModule,
	HyperAPIModuleResponse,
	InferModule,
} from './module.js';
export type {
	HyperAPIRequest,
	HyperAPIRequestArgs,
} from './request.js';
export type { HyperAPIResponse } from './response.js';
export {
	type HyperAPIMethod,
	isHyperApiMethod,
} from './utils/methods.js';
