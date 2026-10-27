// oxlint-disable typescript/no-invalid-void-type

import type { EmptyObject, Merge, Promisable, UnknownRecord } from 'type-fest';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';
// import type { ExtendRequest } from './utils/types.js';

/**
 * What every transport can carry back.
 *
 * This is the floor: drivers whose transport can carry more pass their own
 * response type to `HyperAPIDriver` instead of widening this.
 */
export type HyperAPIModuleResponse = UnknownRecord | unknown[] | undefined;

export class HyperAPIModule<
	Req extends HyperAPIRequest<UnknownRecord>,
	ReqExtra extends UnknownRecord = EmptyObject,
	Resp = HyperAPIModuleResponse,
> {
	private chain: ((
		request: Merge<Req, ReqExtra>,
	) => Promisable<UnknownRecord | void>)[] = [];

	use<ReqAdd extends UnknownRecord | void>(
		fn: (request: Merge<Req, ReqExtra>) => Promisable<ReqAdd>,
	) {
		this.chain.push(fn);

		return this as HyperAPIModule<Req, ReqExtra & ReqAdd, Resp>;
	}

	set<const K extends string, V>(
		key: K,
		fn: (request: Merge<Req, ReqExtra>) => Promisable<V>,
	): HyperAPIModule<Req, ReqExtra & Record<K, V>, Resp>;
	set<const K extends string, V>(
		key: K,
		value: V,
	): HyperAPIModule<Req, ReqExtra & Record<K, V>, Resp>;
	set<const K extends string, V>(key: K, arg1: unknown) {
		this.chain.push(async (request) => {
			const value = typeof arg1 === 'function' ? await arg1(request) : arg1;
			if (value) {
				return { [key]: value };
			}
		});

		return this as HyperAPIModule<Req, ReqExtra & Record<K, V>, Resp>;
	}

	/** Constrained to what the driver this module came from can carry back. */
	action<R extends Resp | void>(
		fn: (request: Merge<Req, ReqExtra>) => Promisable<R>,
	) {
		this.chain.push(async (request) => {
			const response = await fn(request);
			if (response) {
				return { response };
			}
		});

		return this as unknown as HyperAPIModule<
			Req,
			ReqExtra & { response: R },
			Resp
		>;
	}

	/** @internal */
	// eslint-disable-next-line unicorn/prefer-private-class-fields
	async _run(
		request: Req,
	): Promise<
		Merge<Req, Merge<ReqExtra, { response?: HyperAPIResponse<Resp> }>>
	> {
		const request_result = request;
		for (const fn of this.chain) {
			// oxlint-disable-next-line no-await-in-loop
			const request_add = await fn(request_result as Merge<Req, ReqExtra>);
			if (request_add) {
				Object.assign(request_result, request_add);
			}
		}

		return request_result as Awaited<ReturnType<typeof this._run>>;
	}
}
