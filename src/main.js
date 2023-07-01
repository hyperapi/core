
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
	// #driver;
	#root;
	// #middleware;
	#turnDriverOff;

	constructor({
		driver,
		root = joinPath(process.cwd(), 'hyper-api'),
		// middleware = [],
	}) {
		if (driver instanceof HyperAPIDriver !== true) {
			throw new TypeError('Property "driver" must be an instance of HyperAPIDriver.');
		}
		// this.#driver = driver;

		this.#root = root;
		// this.#middleware = middleware;

		const handler = (request) => {
			this.#handler(request)
				.then((response) => request.respondWith(response))
				.catch(() => {}); // #handler never throws
		};

		driver.addEventListener(
			'HyperAPIRequest',
			handler,
		);

		this.#turnDriverOff = () => {
			driver.removeEventListener(
				'HyperAPIRequest',
				handler,
			);
		};
	}

	async #handler(request) {
		try {
			try {
				return await this.#useModule(request);
			}
			catch (error) {
				if (error instanceof HyperAPIError !== true) {
					console.error(error);
					throw new HyperAPIInternalError();
				}

				throw error;
			}
		}
		catch (error) {
			return new HyperAPIResponse(error);
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

		return new HyperAPIResponse(
			await module.default(request),
		);
	}

	destroy() {
		this.#turnDriverOff();
	}
}
