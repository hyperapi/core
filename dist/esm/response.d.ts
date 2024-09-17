import { HyperAPIError } from './error';
import { HyperAPIModuleResponse } from './module';
export type HyperAPIResponse = HyperAPIModuleResponse | HyperAPIError<any>;
