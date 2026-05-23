import { isRecord } from './utils/record.js';

export type HyperAPIErrorData = Record<string, unknown> | undefined;

interface HyperAPIErrorResponse {
	code: number;
	description?: string;
	data?: HyperAPIErrorData;
}

export class HyperAPIError<
	D extends HyperAPIErrorData = undefined,
> extends Error {
	/** The error code. */
	readonly code: number = 0;
	/** The error description. */
	readonly description: string = 'HyperAPI error';
	/** The error data. */
	readonly data?: D;
	/** HTTP status code. */
	readonly httpStatus?: number;
	/** HTTP headers to return. */
	readonly httpHeaders?: Record<string, string>;

	constructor(data?: D, httpHeaders?: Record<string, string>) {
		super();

		if (isRecord(data)) {
			this.data = data;
		}

		if (isRecord(httpHeaders)) {
			this.httpHeaders = {
				...this.httpHeaders,
				...httpHeaders,
			};
		}
	}

	override get message() {
		return `${this.description} (code ${this.code}).`;
	}

	/**
	 * Creates response object.
	 * @returns -
	 */
	getResponse(): HyperAPIErrorResponse {
		const response: HyperAPIErrorResponse = {
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
