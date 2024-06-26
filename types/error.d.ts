/**
 * @typedef {object} HyperAPIErrorResponse
 * @property {number} code - The error code.
 * @property {string} [description] - The error description.
 * @property {{[key: string]: any}} [data] - The error data.
 */
export class HyperAPIError extends Error {
    /**
     * @param {{[key: string]: any}} [data] The error data.
     */
    constructor(data?: {
        [key: string]: any;
    });
    /**
     * The error code.
     * @type {number}
     * @readonly
     */
    readonly code: number;
    /**
     * The error description.
     * @type {string?}
     * @readonly
     */
    readonly description: string | null;
    /**
     * The error data.
     * @type {{[key: string]: any}}
     * @readonly
     */
    readonly data: {
        [key: string]: any;
    };
    /** @type {number?} */
    httpStatus: number | null;
    /** @type {Record<string, any>?} */
    httpHeaders: Record<string, any> | null;
    /**
     * @returns {string} -
     */
    get message(): string;
    /**
     * Creates response object.
     * @returns {HyperAPIErrorResponse} -
     */
    getResponse(): HyperAPIErrorResponse;
}
export type HyperAPIErrorResponse = {
    /**
     * - The error code.
     */
    code: number;
    /**
     * - The error description.
     */
    description?: string;
    /**
     * - The error data.
     */
    data?: {
        [key: string]: any;
    };
};
