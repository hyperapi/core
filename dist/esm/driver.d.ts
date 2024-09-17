import type { HyperAPIRequest } from './request';
import type { HyperAPIResponse } from './response';
import { MaybePromise } from './utils/types';
export type HyperAPIDriverHandler<R extends HyperAPIRequest = HyperAPIRequest> = (request: R) => MaybePromise<HyperAPIResponse>;
export interface HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest> {
    start(handler: HyperAPIDriverHandler<R>): void;
    stop(): void;
}
export type InferDriverRequest<D extends HyperAPIDriver> = D extends HyperAPIDriver<infer R extends HyperAPIRequest> ? R : never;
