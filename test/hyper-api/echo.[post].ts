/* eslint-disable jsdoc/require-jsdoc */

import * as v from 'valibot';
import type {
	HyperAPIRequest,
	HyperAPIResponse,
	InferModule,
} from '../../src/main.js';
import type { hyperApi } from '../setup.js';

type Module = InferModule<typeof hyperApi>;

export default function (
	request: HyperAPIRequest<ReturnType<typeof argsValidator>>,
): HyperAPIResponse {
	return {
		method: {
			expected: 'POST',
			received: request.method,
		},
		message: `Hello, ${request.args.name}!`,
	};
}

export const argsValidator = v.parser(
	v.strictObject({
		name: v.string(),
	}),
);

export const auth: Module['auth'] = true;
