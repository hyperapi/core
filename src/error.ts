import { isRecord } from './utils/record.js';

export type HeadersInit = Exclude<
	ConstructorParameters<typeof Headers>[0],
	undefined
>;
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
	readonly httpHeaders?: Headers;

	constructor(data?: D, httpHeaders?: HeadersInit) {
		super();

		if (isRecord(data)) {
			this.data = data;
		}

		if (httpHeaders) {
			const headers_new = new Headers(httpHeaders);
			if (this.httpHeaders === undefined) {
				this.httpHeaders = headers_new;
			} else {
				for (const [header, value] of headers_new.entries()) {
					this.httpHeaders?.append(header, value);
				}
			}
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
