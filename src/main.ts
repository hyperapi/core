import nodePath                 from 'node:path';
import {
	HyperAPIInternalError,
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
import type { MaybePromise } from './utils/types.js';

interface HyperAPIHandlers<
	D extends HyperAPIDriver,
	R extends InferDriverRequest<D>,
	M extends HyperAPIModule<R>,
> {
	transformer: ((driver_request: Readonly<InferDriverRequest<D>>) => MaybePromise<R>) | void;
	module: ((request: Readonly<R>, module_: M) => MaybePromise<void>)[];
	response: ((request: R, module_: M, response: HyperAPIResponse) => MaybePromise<void>)[];
}

const ENTRYPOINT_PATH = nodePath.dirname(process.argv[1]);

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
		root = nodePath.join(
			ENTRYPOINT_PATH,
			'hyper-api',
		),
	}: {
		driver: D,
		root?: string,
	}) {
		this.driver = driver;
		this.router = createRouter(root);

		this.driver.start(async (driver_request) => {
			const [
				request,
				module_,
				response,
			] = await this.processRequest(driver_request as InferDriverRequest<D>);

			if (request && module_) {
				for (const hook of this.handlers.response) {
					try {
						// eslint-disable-next-line no-await-in-loop
						await hook(request, module_, response);
					}
					catch (error) {
						/* eslint-disable no-console */
						console.error('Error in "response" hook:');
						console.error(error);
						/* eslint-enable no-console */
					}
				}
			}

			return response;
		});
	}

	private handlers: HyperAPIHandlers<D, R, M> = {
		transformer: undefined,
		module: [],
		response: [],
	};

	/**
	 * Use this hook add properties to the request before it is send to the API module.
	 *
	 * This hook can be set only once.
	 * @param transformer The callback function.
	 */
	setTransformer(transformer: typeof this.handlers['transformer']) {
		if (this.handlers.transformer) {
			throw new Error('Transformer has already been set.');
		}

		this.handlers.transformer = transformer;
	}

	/**
	 * Adds a hook to be called when the API module is imported.
	 * @param callback -
	 */
	onModule(callback: typeof this.handlers['module'][number]) {
		this.handlers.module.push(callback);
	}

	/**
	 * Adds a hook to be called right before the response is sent back.
	 *
	 * This hook called only if the request was processed by the API module. If unknown method was requested, this hook is not called.
	 * @param callback -
	 */
	onResponse(callback: typeof this.handlers['response'][number]) {
		this.handlers.response.push(callback);
	}

	private async processRequest(driver_request: InferDriverRequest<D>): Promise<[ R | null, M | null, HyperAPIResponse ]> {
		let request: R | null = null;
		let module_: M | null = null;

		try {
			if (driver_request.path.startsWith('/') !== true) {
				driver_request.path = `/${driver_request.path}`;
			}

			const router_response = await useRouter(
				this.router,
				driver_request.method,
				driver_request.path,
			);

			if (!router_response) {
				return [
					request,
					module_,
					new HyperAPIUnknownMethodError(),
				];
			}

			driver_request.args = {
				...driver_request.args,
				...router_response.args,
			};

			// Send request to the outside user
			request = this.handlers.transformer
				? await this.handlers.transformer(driver_request)
				: driver_request as R;

			// IDEA: "onBeforeModule" hook?

			module_ = (await import(router_response.module_path)) as M;
			if (module_.argsValidator) {
				request.args = module_.argsValidator(request.args);
			}

			for (const hook of this.handlers.module) {
				// eslint-disable-next-line no-await-in-loop
				await hook(request, module_);
			}

			// IDEA: "onBeforeExecute" hook?

			const response = await module_.default(request);

			// IDEA: "onExecute" hook?

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

		throw new Error('Unreachable');
	}

	/** Destroys the HyperAPI instance. */
	destroy() {
		this.handlers.transformer = undefined;
		this.handlers.module.splice(0);
		this.handlers.response.splice(0);
	}
}

export * from './api-errors.js';
export type {
	HyperAPIDriver,
	HyperAPIDriverHandler,
} from './driver.js';
export { HyperAPIError } from './error.js';
export type {
	HyperAPIModule,
	// HyperAPIModuleRequest,
	// HyperAPIModuleResponse,
	InferModule,
} from './module.js';
export type {
	HyperAPIRequest,
	HyperAPIRequestArgs,
} from './request.js';
export type { HyperAPIResponse } from './response.js';
