/**
 * @class HyperAPIRequest
 * @template {Record<string, any>} [HyperAPIRequestArgs={}]
 */
export class HyperAPIRequest<HyperAPIRequestArgs extends Record<string, any> = {}> extends Event {
    /**
     * @param {string} module_path The relative path to the API method module.
     * @param {HyperAPIRequestArgs} args The arguments to pass to the API method.
     */
    constructor(module_path: string, args: HyperAPIRequestArgs);
    /**
     * The unique identifier for this request.
     * @type {string}
     * @readonly
     */
    readonly response_event_name: string;
    /**
     * The relative path to the JavaScript module that contains requested API method.
     * @type {string}
     * @readonly
     */
    readonly module_path: string;
    /**
     * Request arguments to pass to the API method.
     * @type {HyperAPIRequestArgs}
     * @readonly
     */
    readonly args: HyperAPIRequestArgs;
}
