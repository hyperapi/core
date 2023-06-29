
import { join as joinPath } from 'node:path';

import { HyperAPIUnknownMethodError } from './api-errors.js';

export default class HyperAPIRequest extends Event {
	#data = {};

	constructor(method, args) {
		super('HyperAPIRequest');

		this.method = method;
		this.args = args;
		this.flags = {};
	}

	get(key) {
		return this.#data[key];
	}

	set(key, value) {
		this.#data[key] = value;
	}

	get data() {
		return Object.freeze(this.#data);
	}

	async _getModule(root) {
		const filenames = [
			this.method,
			`${this.method}.js`,
			joinPath(this.method, 'index.js'),
		];

		for (const filename of filenames) {
			try {
				// eslint-disable-next-line no-await-in-loop
				return await import(
					joinPath(
						root,
						filename,
					)
				);
			}
			catch {}
		}

		throw new HyperAPIUnknownMethodError();
	}

	#resolve;
	#promise = new Promise((resolve) => {
		this.#resolve = resolve;
	});

	wait() {
		return this.#promise;
	}

	respondWith(response) {
		this.#resolve(response);
	}
}
