import { hyperApi } from '../../server.js';

export default hyperApi
	.module()
	.use(() => {
		return { extra: 1 };
	})
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
