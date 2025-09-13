import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.set('extra', () => 1)
	.set('extra', 2 as const)
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
