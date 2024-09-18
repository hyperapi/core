import { HyperAPIError } from './error.js';
import { HyperAPIModuleResponse } from './module.js';
export type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
