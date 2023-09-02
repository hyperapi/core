
import { join as joinPath } from 'node:path';

import {
	HyperAPIInternalError,
	HyperAPIInvalidParametersError } from './api-errors.js';
import HyperAPIDriver                from './driver.js';
import HyperAPIError                 from './error.js';
import HyperAPIResponse              from './response.js';
import {
	OhMyPropsType,
	OhMyPropsValueError }            from 'oh-my-props';

export default class HyperAPI {
	#driver;
	#root;
	#turnDriverOff;

	/**
	 * Creates a HyperAPI instance.
	 * @param {object} options The options.
	 * @param {HyperAPIDriver} options.driver The HyperAPI driver.
	 * @param {string=} options.root The root directory for API methods modules. Defaults to "/hyper-api" inside the current working directory.
	 */
	constructor({
		driver,
		root = joinPath(
			process.cwd(),
			'hyper-api',
		),
	}) {
		if (driver instanceof HyperAPIDriver !== true) {
			throw new TypeError('Property "driver" must be an instance of HyperAPIDriver.');
		}
		this.#driver = driver;

		this.#root = root;

		this.#setUpListener();
	}

	#setUpListener() {
		const handler = (request) => {
			this.#handleRequest(request)
				.then((hyperAPIResponse) => request._respondWith(hyperAPIResponse))
				.catch(() => {}); // never throws
		};

		this.#driver.addEventListener(
			'HyperAPIRequest',
			handler,
		);

		this.#turnDriverOff = () => {
			this.#driver.removeEventListener(
				'HyperAPIRequest',
				handler,
			);
		};
	}

	async #handleRequest(request) {
		try {
			const response = await this.#useModule(request);
			return new HyperAPIResponse(response);
		}
		catch (error) {
			// error must be an instance of HyperAPIError
			if (error instanceof HyperAPIError !== true) {
				console.error(error);
				// eslint-disable-next-line no-ex-assign
				error = new HyperAPIInternalError();
			}

			return error;
		}
	}

	async #useModule(request) {
		const module = await request._getModule(this.#root);

		if (module.args instanceof OhMyPropsType) {
			try {
				request.args = module.args.cast(request.args);
			}
			catch (error) {
				if (error instanceof OhMyPropsValueError) {
					throw new HyperAPIInvalidParametersError();
				}

				throw error;
			}
		}

		return module.default(request);
	}

	/**
	 * Destroys the HyperAPI instance.
	 */
	destroy() {
		this.#turnDriverOff();
	}
}

export * from './api-errors.js';
export { default as HyperAPIDriver } from './driver.js';
export { default as HyperAPIError } from './error.js';
export { default as HyperAPIRequest } from './request.js';
export { default as HyperAPIResponse } from './response.js';
