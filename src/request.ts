import type { EmptyObject, UnknownRecord } from 'type-fest';
import type { HyperAPIMethod } from './utils/methods.js';

export type HyperAPIRequestArgs = UnknownRecord;

export interface HyperAPIRequest<A extends HyperAPIRequestArgs = EmptyObject> {
	method: HyperAPIMethod;
	path: string;
	args: A;
}
