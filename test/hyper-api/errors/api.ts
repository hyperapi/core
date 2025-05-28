/* eslint-disable jsdoc/require-jsdoc */

import * as v from 'valibot';
import { HyperAPIBusyError } from '../../../src/api-errors.js';
import type { LocalRequest } from '../../setup.js';

export default function (
	request: LocalRequest<ReturnType<typeof argsValidator>>,
) {
	throw new HyperAPIBusyError(
		Object.keys(request.args.error_data).length > 0
			? request.args.error_data
			: undefined,
	);
}

export const argsValidator = v.parser(
	v.strictObject({
		error_data: v.optional(v.record(v.string(), v.any()), () => {
			return {};
		}),
	}),
);
