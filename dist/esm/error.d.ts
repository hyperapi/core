interface HyperAPIErrorResponse {
    code: number;
    description?: string;
    data?: Record<string, unknown>;
}
export type ErrorData = Record<string, unknown> | undefined;
export declare class HyperAPIError<D extends Record<string, unknown> | undefined> extends Error {
    /** The error code. */
    readonly code: number;
    /** The error description. */
    readonly description: string;
    /** The error data. */
    readonly data?: D;
    /** HTTP status code. */
    readonly httpStatus?: number;
    /** HTTP headers to return. */
    readonly httpHeaders?: Record<string, string>;
    constructor(data?: D);
    get message(): string;
    /**
     * Creates response object.
     * @returns -
     */
    getResponse(): HyperAPIErrorResponse;
}
export {};
