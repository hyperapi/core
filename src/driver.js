
import { HyperAPIRequest }  from './request.js';
import { HyperAPIResponse } from './response.js';

export class HyperAPIDriver extends EventTarget {
	/**
	 * @param {HyperAPIRequest} request -
	 * @returns {Promise<HyperAPIResponse>} -
	 */
	async processRequest(request) {
		const promise = new Promise((resolve) => {
			this.addEventListener(
				request.response_event_name,
				(response) => {
					if (response instanceof HyperAPIResponse) {
						resolve(response);
					}
				},
				{
					once: true,
				},
			);
		});

		this.dispatchEvent(request);

		return promise;
	}
}
