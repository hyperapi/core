
/* eslint-disable jsdoc/require-jsdoc */

export default function (request) {
	return {
		message: `Hello, ${request.args.name}!`,
	};
}

import * as v      from 'valibot';
import { valibot } from '../validator.js';

export const argsValidator = valibot.bind(
	v.strictObject({
		name: v.string(),
	}),
);
