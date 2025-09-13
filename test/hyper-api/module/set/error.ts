import { HyperAPIInvalidParametersError } from '../../../../src/api-errors.js';
import { hyperApi } from '../../../server.js';

export default hyperApi
	.module()
	.set('extra', () => {
		throw new HyperAPIInvalidParametersError();
	})
	.action((request) => {
		return {
			extra: request.extra,
		};
	});
