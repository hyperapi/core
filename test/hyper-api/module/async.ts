import { hyperApi } from '../../server.js';

export default hyperApi.module().action(async () => {
	await Promise.resolve();

	return { foo: 1 };
});
