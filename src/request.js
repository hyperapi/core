
import { randomUUID } from 'node:crypto';

/**
 * @class HyperAPIRequest
 * @template {Record<string, any>} [HyperAPIRequestArgs={}]
 */
export class HyperAPIRequest extends Event {
	/**
	 * The unique identifier for this request.
	 * @type {string}
	 * @readonly
	 */
	response_event_name = 'response:' + randomUUID();

	/**
	 * The relative path to the JavaScript module that contains requested API method.
	 * @type {string}
	 * @readonly
	 */
	module_path;

	/**
	 * Request arguments to pass to the API method.
	 * @type {HyperAPIRequestArgs}
	 * @readonly
	 */
	args;

	/**
	 * @param {string} module_path The relative path to the API method module.
	 * @param {HyperAPIRequestArgs} args The arguments to pass to the API method.
	 */
	constructor(module_path, args) {
		super('request');

		this.module_path = module_path;
		this.args = args;
	}
}
