/* eslint-disable jsdoc/require-jsdoc */

import { OhMyPropsObjectValidator } from 'oh-my-props';

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

export const args = new OhMyPropsObjectValidator({
	name: {
		type: String,
		required: true,
	},
});
