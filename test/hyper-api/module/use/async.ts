import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.use(async () => {
		await Promise.resolve();
		return {
			extra: 1,
		};
	})
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
