
import { join as joinPath }      from 'node:path';
import { HyperAPIInternalError } from './api-errors.js';
import { HyperAPIDriver }        from './driver.js';
import { HyperAPIError }         from './error.js';
import { HyperAPIResponse }      from './response.js';

/**
 * @typedef {import('./request.js').default} HyperAPIRequest
 */

export class HyperAPI {
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
		const handler = async (request) => {
			try {
				request._respondWith(
					await this.#handleRequest(request),
				);
			}
			catch (error) {
				// should never happen
				console.error('Unexpected error happened:');
				console.error(error);
				process.exit(); // eslint-disable-line no-process-exit, unicorn/no-process-exit
			}
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

	/**
	 * Processes a request and returns the response.
	 * @param {HyperAPIRequest} request The HyperAPI request.
	 * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
	 */
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

			return new HyperAPIResponse(error);
		}
	}

	async #useModule(request) {
		const module = await request._getModule(this.#root);

		if (typeof module.argsValidator === 'function') {
			request.args = await module.argsValidator(request.args);
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
export { HyperAPIDriver } from './driver.js';
export { HyperAPIError } from './error.js';
export { HyperAPIRequest } from './request.js';
export { HyperAPIResponse } from './response.js';
