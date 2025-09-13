import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.use(() => {
		return { extra: 1 };
	})
	.use(() => {
		return { extra: 2 as const };
	})
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
