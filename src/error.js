
/**
 * @typedef {object} HyperAPIErrorResponse
 * @property {number} code - The error code.
 * @property {string} [description] - The error description.
 * @property {{[key: string]: any}} [data] - The error data.
 */

export class HyperAPIError extends Error {
	/**
	 * The error code.
	 * @type {number}
	 * @readonly
	 */
	code;

	/**
	 * The error description.
	 * @type {string?}
	 * @readonly
	 */
	description = null;

	/**
	 * The error data.
	 * @type {{[key: string]: any}}
	 * @readonly
	 */
	data;

	/** @type {number?} */
	httpStatus;

	/** @type {Record<string, any>?} */
	httpHeaders;

	/**
	 * @param {{[key: string]: any}} [data] The error data.
	 */
	constructor(data) {
		super();

		if (data !== null && typeof data === 'object') {
			this.data = data;
		}
		else if (data !== undefined) {
			throw new TypeError('Argument 0 must be an object or not be provided');
		}
	}

	/**
	 * @returns {string} -
	 */
	get message() {
		return `${this.description ?? ''} (code ${this.code})`;
	}

	/**
	 * Creates response object.
	 * @returns {HyperAPIErrorResponse} -
	 */
	getResponse() {
		/** @type {HyperAPIErrorResponse} */
		const result = {
			code: this.code,
		};

		if (typeof this.description === 'string') {
			result.description = this.description;
		}

		if (this.data) {
			result.data = this.data;
		}

		return result;
	}
}
