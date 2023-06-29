
export default class HyperAPIError extends Error {
	#data;

	constructor(data) {
		super();

		this.#data = data;
	}

	get message() {
		return `${this.description} (code ${this.code})`;
	}

	getResponse() {
		const response = {
			code: this.code,
		};

		if (typeof this.description === 'string') {
			response.description = this.description;
		}

		if (this.#data) {
			response.data = this.#data;
		}

		return response;
	}
}
