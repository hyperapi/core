// oxlint-disable typescript/no-explicit-any

import type { HyperAPIError } from './error.js';
import type { HyperAPIModuleResponse } from './module.js';

/** What a driver gets back from the core: a module response, or an error. */
export type HyperAPIResponse<Resp = HyperAPIModuleResponse> =
	| Resp
	| HyperAPIError<any>;
