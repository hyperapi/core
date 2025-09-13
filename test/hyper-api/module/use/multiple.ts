import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.use(() => {
		return { extra1: 1 };
	})
	.use(async () => {
		await Promise.resolve();
		return { extra2: 2 };
	})
	.action((request) => {
		return {
			extra: [request.extra1, request.extra2],
		};
	});
