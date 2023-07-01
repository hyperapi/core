
import { HyperAPIBusyError } from '../../src/api-errors.js';

export default function () {
	throw new HyperAPIBusyError();
}
