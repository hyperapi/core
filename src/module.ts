import type { Promisable } from 'type-fest';
import type { HyperAPI } from './main.js';
import type { HyperAPIRequest, HyperAPIRequestArgs } from './request.js';

export type HyperAPIModuleResponse =
	| Record<string, unknown>
	| Response
	| unknown[]
	| undefined;

export interface HyperAPIModule<
	R extends HyperAPIRequest<HyperAPIRequestArgs>,
> {
	readonly default: (request: R) => Promisable<HyperAPIModuleResponse>;
	readonly argsValidator: (
		args: unknown,
	) => R extends HyperAPIRequest<infer A> ? A : never;
}

// export type HyperAPIModuleRequest<M extends HyperAPIModule<HyperAPIRequest>> = Parameters<M['default']>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferModule<H extends HyperAPI<any, any, any>> = H extends HyperAPI<
	infer _D,
	infer _R,
	infer M
>
	? M
	: never;
