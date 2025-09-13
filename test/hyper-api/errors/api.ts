import { HyperAPIBusyError } from '../../../src/api-errors.js';
import { hyperApi } from '../../server.js';

export default hyperApi.module().action(() => {
	throw new HyperAPIBusyError();
});
