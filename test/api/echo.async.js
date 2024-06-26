
/* eslint-disable jsdoc/require-jsdoc */

export default async function (request) {
	await new Promise((resolve) => {
		setTimeout(
			resolve,
			10,
		);
	});

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
