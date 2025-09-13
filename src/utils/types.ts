import type { IsEqual, Simplify } from 'type-fest';
import type { HyperAPIRequest } from '../request.js';
import type { BaseRecord, EmptyObject } from './record.js';

export type Join<
	R extends HyperAPIRequest<BaseRecord>,
	ReqExtra extends BaseRecord,
> = R &
	([ReqExtra] extends [never]
		? unknown
		: IsEqual<ReqExtra, EmptyObject> extends true
			? unknown
			: ReqExtra);
export type Extend<
	V1 extends BaseRecord,
	V2 extends BaseRecord | void,
> = Simplify<
	V2 extends void
		? V1
		: ([V1] extends [never]
				? unknown
				: IsEqual<V1, EmptyObject> extends true
					? unknown
					: V1) &
				V2
>;
