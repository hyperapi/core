
import { OhMyPropsObjectValidator } from 'oh-my-props';

export default function (request) {
	return `Hello, ${request.args.name}!`;
}

export const args = new OhMyPropsObjectValidator({
	name: {
		type: String,
		required: true,
	},
});
