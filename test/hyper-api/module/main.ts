import { hyperApi } from '../../server.js';

export default hyperApi.module().action((request) => {
	return {
		external: 'external' in request ? request.external : undefined,
	};
});
