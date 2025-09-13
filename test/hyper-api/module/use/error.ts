import { HyperAPIInvalidParametersError } from '../../../../src/api-errors.js';
import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.use(() => {
		throw new HyperAPIInvalidParametersError();
	})
	.action((request) => {
		return {
			foo: request.foo,
		};
	});
