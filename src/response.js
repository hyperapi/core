
import { HyperAPIError }   from './error.js';
import { HyperAPIRequest } from './request.js';

export class HyperAPIResponse extends Event {
	/**
	 * Creates a HyperAPI response.
	 * @param {HyperAPIRequest} request The request.
	 * @param {HyperAPIError | Record<string, any> | any[]} value The error or the response value.
	 */
	constructor(request, value) {
		super(request.response_event_name);

		if (value instanceof HyperAPIError) {
			this.error = value;
		}
		else if (value === undefined) {
			this.data = {};
		}
		else if (
			(value !== null && typeof value === 'object') // object
			|| Array.isArray(value) // array
		) {
			this.data = value;
		}
		else {
			throw new TypeError('Argument 0 must be an instance of HyperAPIError or be an object or an array.');
		}
	}

	/**
	 * @returns {boolean} Whether the response is successful.
	 * @readonly
	 */
	get is_success() {
		return this.error === undefined;
	}

	/**
	 * Returns response as an object. For example, that can be used as the body of a HTTP response.
	 * @returns {{[key: string]: *}?} The response.
	 */
	getResponse() {
		if (this.error) {
			return this.error.getResponse();
		}

		return this.data;
	}
}
