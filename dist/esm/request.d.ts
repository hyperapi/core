import type { HyperAPIMethod } from './utils/methods.js';
import type { EmptyObject } from './utils/types.js';
export type HyperAPIRequestArgs = Record<string, unknown>;
export interface HyperAPIRequest<A extends HyperAPIRequestArgs = EmptyObject> {
    method: HyperAPIMethod;
    path: string;
    args: A;
}
