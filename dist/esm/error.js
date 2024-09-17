import { isRecord } from './utils/is-record';
export class HyperAPIError extends Error {
    /** The error code. */
    code = 0;
    /** The error description. */
    description = 'HyperAPI error';
    /** The error data. */
    data;
    /** HTTP status code. */
    httpStatus;
    /** HTTP headers to return. */
    httpHeaders;
    constructor(data) {
        super();
        if (isRecord(data)) {
            this.data = data;
        }
    }
    get message() {
        return `${this.description} (code ${this.code}).`;
    }
    /**
     * Creates response object.
     * @returns -
     */
    getResponse() {
        const response = {
            code: this.code,
        };
        if (typeof this.description === 'string') {
            response.description = this.description;
        }
        if (this.data) {
            response.data = this.data;
        }
        return response;
    }
}
