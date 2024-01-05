
import { join as joinPath }           from 'node:path';
import { HyperAPIUnknownMethodError } from './api-errors.js';

/**
 * @typedef {import('./response.js').default} HyperAPIResponse
 */

export class HyperAPIRequest extends Event {
	#data = new Map();

	/**
	 * @param {string} module_path The relative path to the API method module.
	 * @param {Array<*>} args The arguments to pass to the API method.
	 */
	constructor(module_path, args) {
		super('HyperAPIRequest');

		this.module_path = module_path;
		this.args = args;
		this.flags = {};
	}

	/**
	 * @param {*} key The key to get.
	 * @returns {*} The value.
	 */
	get(key) {
		return this.#data.get(key);
	}

	/**
	 * @param {*} key The key to set.
	 * @param {*} value The value to set.
	 */
	set(key, value) {
		this.#data.set(key, value);
	}

	async _getModule(root) {
		const filenames = [
			this.module_path,
			`${this.module_path}.js`,
			`${this.module_path}.mjs`,
			`${this.module_path}.cjs`,
			joinPath(this.module_path, 'index.js'),
		];

		for (const filename of filenames) {
			const path = joinPath(
				root,
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

				throw error;
			}
		}

		throw new HyperAPIUnknownMethodError();
	}

	#resolve;
	#promise = new Promise((resolve) => {
		this.#resolve = resolve;
	});

	/**
	 * @returns {Promise<HyperAPIResponse>} The response.
	 */
	wait() {
		return this.#promise;
	}

	/**
	 * @param {HyperAPIResponse} response The response.
	 */
	_respondWith(response) {
		this.#resolve(response);
	}
}
