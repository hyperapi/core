import type { Promisable } from 'type-fest';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';

export type HyperAPIDriverHandler<R extends HyperAPIRequest = HyperAPIRequest> =
	(request: R) => Promisable<HyperAPIResponse>;

export interface HyperAPIDriver<R extends HyperAPIRequest = HyperAPIRequest> {
	start(handler: HyperAPIDriverHandler<R>): void;
	stop(): void;
}

export type InferDriverRequest<D extends HyperAPIDriver> =
	D extends HyperAPIDriver<infer R extends HyperAPIRequest> ? R : never;
