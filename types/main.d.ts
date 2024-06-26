export class HyperAPI {
    /**
     * Creates a HyperAPI instance.
     * @param {object} options The options.
     * @param {HyperAPIDriver} options.driver The HyperAPI driver.
     * @param {string} [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
     */
    constructor({ driver, root, }: {
        driver: HyperAPIDriver;
        root?: string;
    });
    /**
     * Destroys the HyperAPI instance.
     */
    destroy(): void;
    #private;
}
export * from "./api-errors.js";
export { HyperAPIDriver } from "./driver.js";
export { HyperAPIError } from "./error.js";
export { HyperAPIRequest } from "./request.js";
export { HyperAPIResponse } from "./response.js";
export type HyperAPIModule = {
    /**
     * Core function of the API method.
     */
    default: (arg0: HyperAPIRequest) => HyperAPIModuleResponse | Promise<HyperAPIModuleResponse>;
    /**
     * - Function that validates `args` property of the HyperAPIRequest. Should return validated args or throw an error.
     */
    argsValidator?: (arg0: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    } | Promise<{
        [key: string]: any;
    }>;
};
export type HyperAPIModuleResponse = Record<string, any> | any[] | undefined;
import { HyperAPIDriver } from './driver.js';
import { HyperAPIRequest } from './request.js';
