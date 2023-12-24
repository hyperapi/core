
import { HyperAPIRequest } from './request.js';

/**
 * @typedef {import('./response.js').default} HyperAPIResponse
 */

export class HyperAPIDriver extends EventTarget {
	/**
	 * Processes a request and waits for the response.
	 * @async
	 * @param {HyperAPIRequest} request The HyperAPI request.
	 * @returns {Promise<HyperAPIResponse>} The HyperAPI response.
	 */
	onRequest(request) {
		if (request instanceof HyperAPIRequest !== true) {
			throw new TypeError('Argument 0 must be an instance of HyperAPIRequest.');
		}

		this.dispatchEvent(request);

		return request.wait();
	}
}
