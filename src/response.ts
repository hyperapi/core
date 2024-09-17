import { HyperAPIError } from './error';
import { HyperAPIModuleResponse } from './module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
