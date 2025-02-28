import type { HyperAPIDriver, InferDriverRequest } from './driver.js';
import type { HyperAPIModule } from './module.js';
import type { HyperAPIRequest } from './request.js';
export declare class HyperAPI<D extends HyperAPIDriver<HyperAPIRequest>, R extends InferDriverRequest<D>, M extends HyperAPIModule<R> = HyperAPIModule<R>> {
    private router;
    private driver;
    /**
     * Creates a HyperAPI instance.
     * @param options The options.
     * @param options.driver The driver.
     * @param [options.root] The root directory for API methods modules. Default: `hyper-api` directory alongside the entrypoint script.
     */
    constructor({ driver, root, }: {
        driver: D;
        root?: string;
    });
    private handlers;
    /**
     * Use this hook add properties to the request before it is send to the API module.
     *
     * This hook can be set only once.
     * @param transformer The callback function.
     */
    setTransformer(transformer: typeof this.handlers['transformer']): void;
    /**
     * Adds a hook to be called when the API module is imported.
     * @param callback -
     */
    onModule(callback: typeof this.handlers['module'][number]): void;
    /**
     * Adds a hook to be called right before the response is sent back.
     *
     * This hook called only if the request was processed by the API module. If unknown method was requested, this hook is not called.
     * @param callback -
     */
    onResponse(callback: typeof this.handlers['response'][number]): void;
    private processRequest;
    /** Destroys the HyperAPI instance. */
    destroy(): void;
}
export * from './api-errors.js';
export type { HyperAPIDriver, HyperAPIDriverHandler, } from './driver.js';
export { HyperAPIError } from './error.js';
export type { HyperAPIModule, InferModule, } from './module.js';
export type { HyperAPIRequest, HyperAPIRequestArgs, } from './request.js';
export type { HyperAPIResponse } from './response.js';
export { isHyperApiMethod, type HyperAPIMethod, } from './utils/methods.js';
