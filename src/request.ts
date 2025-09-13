import type { HyperAPIMethod } from './utils/methods.js';
import type { BaseRecord, EmptyObject } from './utils/record.js';

export type HyperAPIRequestArgs = BaseRecord;

export interface HyperAPIRequest<A extends HyperAPIRequestArgs = EmptyObject> {
	method: HyperAPIMethod;
	path: string;
	args: A;
}
