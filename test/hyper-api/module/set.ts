import { hyperApi } from '../../server.js';

export default hyperApi
	.module()
	.set('extra', () => 1)
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
