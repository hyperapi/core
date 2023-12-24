
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
	 * @type {{[key: string]: *}?}
	 * @readonly
	 */
	data = null;

	/**
	 * @param {{[key: string]: *}?} data The error data. Cannot contain "code" or "description" properties.
	 */
	constructor(data = null) {
		super();

		if (
			data !== null
			&& typeof data !== 'object'
		) {
			throw new TypeError('Argument 0 must be an object or not be provided');
		}

		if (
			data
			&& (
				'code' in data
				|| 'description' in data
			)
		) {
			throw new TypeError('Argument 0 must not contain "code" or "description" properties');
		}

		this.data = data;
	}

	get message() {
		return `${this.description ?? ''} (code ${this.code})`;
	}

	getResponse() {
		const result = {
			code: this.code,
		};
		if (typeof this.description === 'string') {
			result.description = this.description;
		}

		return {
			...result,
			...this.data,
		};
	}
}
