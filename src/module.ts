// oxlint-disable typescript/no-invalid-void-type

import type { Promisable } from 'type-fest';
import type { HyperAPIRequest } from './request.js';
import type { BaseRecord } from './utils/record.js';
import type { Extend, Join } from './utils/types.js';

export type HyperAPIModuleResponse =
	| Response
	| BaseRecord
	| unknown[]
	| undefined;

export class HyperAPIModule<
	Req extends HyperAPIRequest<BaseRecord>,
	ReqExtra extends BaseRecord = never,
> {
	private chain: ((
		request: Join<Req, ReqExtra>,
	) => Promisable<BaseRecord | void>)[] = [];

	use<ReqAdd extends BaseRecord | void>(
		fn: (request: Join<Req, ReqExtra>) => Promisable<ReqAdd>,
	) {
		this.chain.push(fn);

		return this as unknown as HyperAPIModule<Req, Extend<ReqExtra, ReqAdd>>;
	}

	set<const K extends string, V>(
		key: K,
		fn: (request: Join<Req, ReqExtra>) => Promisable<V>,
	): HyperAPIModule<Req, Extend<ReqExtra, Record<K, V>>>;
	set<const K extends string, V>(
		key: K,
		value: V,
	): HyperAPIModule<Req, Extend<ReqExtra, Record<K, V>>>;
	set<const K extends string, V>(key: K, arg1: unknown) {
		this.chain.push(async (request) => {
			const value = typeof arg1 === 'function' ? await arg1(request) : arg1;
			if (value) {
				return { [key]: value };
			}
		});

		return this as unknown as HyperAPIModule<
			Req,
			Extend<ReqExtra, Record<K, V>>
		>;
	}

	action<Resp extends HyperAPIModuleResponse | void>(
		fn: (request: Join<Req, ReqExtra>) => Promisable<Resp>,
	) {
		this.chain.push(async (request) => {
			const response = await fn(request);
			if (response) {
				return { response };
			}
		});

		return this as unknown as HyperAPIModule<
			Req,
			Extend<ReqExtra, { response: Resp }>
		>;
	}

	async _run(
		request: Req,
	): Promise<Join<Req, Extend<ReqExtra, { response?: unknown }>>> {
		const request_result = request;
		for (const fn of this.chain) {
			// oxlint-disable-next-line no-await-in-loop
			const request_add = await fn(request_result as Join<Req, ReqExtra>);
			if (request_add) {
				Object.assign(request_result, request_add);
			}
		}

		return request_result as Awaited<ReturnType<typeof this._run>>;
	}
}
