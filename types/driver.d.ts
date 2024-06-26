export class HyperAPIDriver extends EventTarget {
    /**
     * @param {HyperAPIRequest} request -
     * @returns {Promise<HyperAPIResponse>} -
     */
    processRequest(request: HyperAPIRequest): Promise<HyperAPIResponse>;
}
import { HyperAPIRequest } from './request.js';
import { HyperAPIResponse } from './response.js';
