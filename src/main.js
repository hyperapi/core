
/**
 * @typedef {object} HyperAPIModule
 * @property {function(HyperAPIRequest): HyperAPIModuleResponse | Promise<HyperAPIModuleResponse>} default Core function of the API method.
 * @property {function({ [key: string]: any }): { [key: string]: any } | Promise<{ [key: string]: any }>} [argsValidator] - Function that validates `args` property of the HyperAPIRequest. Should return validated args or throw an error.
 * @typedef {Record<string, any> | any[] | undefined} HyperAPIModuleResponse
 */

import {
	dirname,
	join as joinPath }           from 'node:path';
import {
	HyperAPIInternalError,
	HyperAPIUnknownMethodError } from './api-errors.js';
import { HyperAPIDriver }        from './driver.js';
import { HyperAPIError }         from './error.js';
import { HyperAPIRequest }       from './request.js';
import { HyperAPIResponse }      from './response.js';

const ENTRYPOINT_PATH = dirname(process.argv[1]);

export class HyperAPI {
	/** @type {HyperAPIDriver} The HyperAPI driver. */
	#driver;

	/** @type {string} The root directory for API methods modules. */
	#root;

	/** @type {function(HyperAPIRequest): void} Handles a request. */
	#requestHandler;

	/**
	 * Creates a HyperAPI instance.
	 * @param {object} options The options.
	 * @param {HyperAPIDriver} options.driver The HyperAPI driver.
	 * @param {string} [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
	 */
	constructor({
		driver,
		root = joinPath(
			ENTRYPOINT_PATH,
			'hyper-api',
		),
	}) {
		if (driver instanceof HyperAPIDriver !== true) {
			throw new TypeError('Property "driver" must be an instance of HyperAPIDriver.');
		}
		this.#driver = driver;

		this.#requestHandler = async (request) => {
			try {
				const response = await this.#handleRequest(request);

				this.#driver.dispatchEvent(response);
			}
			catch (error) {
				// should never happen
				console.error('Unexpected error happened:');
				console.error(error);
				console.error('This error should not have reached this point.');
				console.error('This is probably a bug in the HyperAPI driver you are using or in the HyperAPI itself.');
				console.error('Now exiting the process.');

				// eslint-disable-next-line no-process-exit, unicorn/no-process-exit
				process.exit(1);
			}
		};

		this.#driver.addEventListener(
			'request',
			this.#requestHandler,
		);

		this.#root = root;
	}

	/**
	 * Removes the request event listener from the driver.
	 */
	#turnDriverOff() {
		this.#driver.removeEventListener(
			'request',
			this.#requestHandler,
		);
	}

	/**
	 * Processes a request and returns the response.
	 * @param {HyperAPIRequest} request The HyperAPI request.
	 * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
	 */
	async #handleRequest(request) {
		try {
			const response_data = await this.#useModule(request);
			return new HyperAPIResponse(
				request,
				response_data,
			);
		}
		catch (error) {
			// error must be an instance of HyperAPIError
			if (error instanceof HyperAPIError !== true) {
				console.error(error);
				// eslint-disable-next-line no-ex-assign
				error = new HyperAPIInternalError();
			}

			return new HyperAPIResponse(
				request,
				error,
			);
		}
	}

	/**
	 * Processes a request and returns the response.
	 * @param {HyperAPIRequest} request The HyperAPI request.
	 * @returns {Promise<HyperAPIModule>} The HyperAPI response.
	 */
	async #getModule(request) {
		const filenames = [
			request.module_path,
			`${request.module_path}.js`,
			`${request.module_path}.mjs`,
			`${request.module_path}.cjs`,
			joinPath(request.module_path, 'index.js'),
		];

		for (const filename of filenames) {
			const path = joinPath(
				this.#root,
				filename,
			);

			try {
				// eslint-disable-next-line no-await-in-loop
				return await import(path);
			}
			catch (error) {
				if (
					error.code === 'MODULE_NOT_FOUND' // node
					|| error.code === 'ERR_MODULE_NOT_FOUND' // bun
				) {
					const path_error = error.moduleName // node
						?? error.specifier // bun
						?? new URL(error.url).pathname; // node v20.10 in raw, not in jest's test env

					// skip error only if we cannot found the module itself
					if (path === path_error) {
						continue;
					}
				}

				// vitest
				if (
					error instanceof Error
					&& error.message.startsWith(`Failed to load url ${path} `)
				) {
					continue;
				}

				throw error;
			}
		}

		throw new HyperAPIUnknownMethodError();
	}

	/**
	 * Processes a request and returns the response.
	 * @param {HyperAPIRequest} request The HyperAPI request.
	 * @returns {Promise<HyperAPIModuleResponse>} The HyperAPI response.
	 */
	async #useModule(request) {
		const module = await this.#getModule(request);

		if (typeof module.argsValidator === 'function') {
			// We assign to the readonly property "args" only internally, so we can safely ignore the TS error.
			// @ts-ignore
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
