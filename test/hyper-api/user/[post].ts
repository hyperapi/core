/* eslint-disable jsdoc/require-jsdoc */

import * as v from 'valibot';
import type { HyperAPIResponse } from '../../../src/main.js';
import type { LocalRequest } from '../../setup.js';

export default function (
	request: LocalRequest<ReturnType<typeof argsValidator>>,
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
