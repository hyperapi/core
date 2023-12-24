
/* eslint-disable jsdoc/require-jsdoc */

export default function (request) {
	return {
		message: `Hello, ${request.args.name}!`,
	};
}

import {
	never,
	object,
	string }       from 'valibot';
import { valibot } from '../validator.js';

export const argsValidator = valibot.bind(
	object(
		{
			name: string(),
		},
		never(),
	),
);
