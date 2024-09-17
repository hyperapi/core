/* eslint-disable jsdoc/require-jsdoc */

import * as v from 'valibot';
import { type HyperAPIResponse } from '../../src/main';
import { type LocalRequest } from '../setup';

export default function (request: LocalRequest<ReturnType<typeof argsValidator>>): HyperAPIResponse {
	return {
		method: 'ALL',
		message: `Hello, ${request.args.name}!`,
	};
}

export const argsValidator = v.parser(
	v.strictObject({
		name: v.string(),
	}),
);
