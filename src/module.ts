// oxlint-disable typescript/no-invalid-void-type

import type { EmptyObject, Merge, Promisable, UnknownRecord } from 'type-fest';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';
// import type { ExtendRequest } from './utils/types.js';

export type HyperAPIModuleResponse =
	| Response
	| UnknownRecord
	| unknown[]
	| undefined;

export class HyperAPIModule<
	Req extends HyperAPIRequest<UnknownRecord>,
	ReqExtra extends UnknownRecord = EmptyObject,
> {
	private chain: ((
		request: Merge<Req, ReqExtra>,
	) => Promisable<UnknownRecord | void>)[] = [];

	use<ReqAdd extends UnknownRecord | void>(
		fn: (request: Merge<Req, ReqExtra>) => Promisable<ReqAdd>,
	) {
		this.chain.push(fn);

		return this as HyperAPIModule<Req, ReqExtra & ReqAdd>;
	}

	set<const K extends string, V>(
		key: K,
		fn: (request: Merge<Req, ReqExtra>) => Promisable<V>,
	): HyperAPIModule<Req, ReqExtra & Record<K, V>>;
	set<const K extends string, V>(
		key: K,
		value: V,
	): HyperAPIModule<Req, ReqExtra & Record<K, V>>;
	set<const K extends string, V>(key: K, arg1: unknown) {
		this.chain.push(async (request) => {
			const value = typeof arg1 === 'function' ? await arg1(request) : arg1;
			if (value) {
				return { [key]: value };
			}
		});

		return this as HyperAPIModule<Req, ReqExtra & Record<K, V>>;
	}

	action<Resp extends HyperAPIModuleResponse | void>(
		fn: (request: Merge<Req, ReqExtra>) => Promisable<Resp>,
	) {
		this.chain.push(async (request) => {
			const response = await fn(request);
			if (response) {
				return { response };
			}
		});

		return this as unknown as HyperAPIModule<
			Req,
			ReqExtra & { response: Resp }
		>;
	}

	/** @internal */
	async _run(
		request: Req,
	): Promise<Merge<Req, Merge<ReqExtra, { response?: HyperAPIResponse }>>> {
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
