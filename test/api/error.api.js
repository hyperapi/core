
import { HyperAPIBusyError } from '../../src/api-errors.js';

export default function (request) {
	console.log(request);

	throw new HyperAPIBusyError();
}
