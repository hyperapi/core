
import HyperAPIRequest from './request.js';

export default class HyperAPIDriver extends EventTarget {
	/* async */ onRequest(request) {
		if (request instanceof HyperAPIRequest !== true) {
			throw new TypeError('Argument 0 must be an instance of HyperAPIRequest.');
		}

		this.dispatchEvent(request);

		return request.wait();
	}
}
