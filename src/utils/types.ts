// oxlint-disable typescript/no-invalid-void-type

import type { IsEqual, IsNever, Merge } from 'type-fest';
import type { HyperAPIRequest } from '../request.js';
import type { BaseRecord, EmptyObject } from './record.js';

type IsRecord<T extends BaseRecord | void> =
	IsNever<T> extends true
		? false
		: T extends void
			? false
			: IsEqual<T, EmptyObject> extends true
				? false
				: true;

export type Join<
	R extends HyperAPIRequest<BaseRecord>,
	ReqExtra extends BaseRecord,
> = IsRecord<ReqExtra> extends true ? Merge<R, ReqExtra> : R;

export type Extend<V1 extends BaseRecord, V2 extends BaseRecord | void> =
	IsRecord<V1> extends true
		? IsRecord<V2> extends true
			? Merge<V1, V2>
			: V1
		: IsRecord<V2> extends true
			? Exclude<V2, void>
			: EmptyObject;
