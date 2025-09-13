import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.set('extra', async () => {
		await Promise.resolve();
		return 1;
	})
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
