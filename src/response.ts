import type { HyperAPIError } from './error.js';
import type { HyperAPIModuleResponse } from './module.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
