
import HyperAPIError from './error.js';

export default class HyperAPIResponse {
	constructor(value) {
		if (value instanceof HyperAPIError) {
			this.error = value;
		}
		else if (
			(value !== null && typeof value === 'object') // object
			|| Array.isArray(value) // array
			|| typeof value === 'string' // string
			|| typeof value === 'number' // number
			|| typeof value === 'boolean' // boolean
		) {
			this.data = value;
		}
		else {
			throw new TypeError('Argument 0 must be an instance of HyperAPIError or a valid response value.');
		}
	}

	object() {
		const data = {
			code: this.error?.code ?? 0,
		};

		if (this.error && typeof this.error.description === 'string') {
			data.description = this.error.description;
		}

		if (this.data !== undefined) {
			data.data = this.data;
		}

		return data;
	}

	array() {
		const result = [
			this.error?.code ?? 0,
		];

		if (this.error) {
			result.push(this.error.description ?? '');
		}

		if (this.data !== undefined) {
			result.push(this.data);
		}

		return result;
	}

	json() {
		return JSON.stringify(
			this.object(),
		);
	}

	compactJSON() {
		return JSON.stringify(
			this.array(),
		);
	}
}
