import type {
	EmptyObject,
	HTTPMethod,
} from './utils/types.js';

export type HyperAPIRequestArgs = Record<string, unknown>;

export interface HyperAPIRequest<
	A extends HyperAPIRequestArgs = EmptyObject,
> {
	method: HTTPMethod;
	path: string;
	args: A;
}
