import type { EmptyObject } from 'type-fest';
import type { HyperAPIMethod } from './utils/methods.js';

export type HyperAPIRequestArgs = Record<string, unknown>;

export interface HyperAPIRequest<A extends HyperAPIRequestArgs = EmptyObject> {
	method: HyperAPIMethod;
	path: string;
	args: A;
}
