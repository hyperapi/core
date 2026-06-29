import { hyperApi } from '../../server.js';

export default hyperApi.module().action((request) => {
	return {
		path: decodeURIComponent(import.meta.url.split('/hyper-api/')[1]!),
		method: request.method,
		args: request.args,
		foo_type: typeof request.foo,
	};
});
