import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.set('extra1', () => 1 as const)
	.set('extra2', () => 2 as const)
	.action((request) => {
		return {
			extra: [request.extra1, request.extra2],
		};
	});
