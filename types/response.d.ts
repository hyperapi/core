export class HyperAPIResponse extends Event {
    /**
     * Creates a HyperAPI response.
     * @param {HyperAPIRequest} request The request.
     * @param {HyperAPIError | Record<string, any> | any[]} value The error or the response value.
     */
    constructor(request: HyperAPIRequest, value: HyperAPIError | Record<string, any> | any[]);
    error: HyperAPIError;
    data: any[] | Record<string, any>;
    /**
     * @returns {boolean} Whether the response is successful.
     * @readonly
     */
    readonly get is_success(): boolean;
    /**
     * Returns response as an object. For example, that can be used as the body of a HTTP response.
     * @returns {{[key: string]: *}?} The response.
     */
    getResponse(): {
        [key: string]: any;
    } | null;
}
import { HyperAPIError } from './error.js';
import { HyperAPIRequest } from './request.js';
