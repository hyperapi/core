import { HyperAPI } from '../src/main.js';
import { HyperAPITestDriver } from './driver.js';

export const driver = new HyperAPITestDriver();
export const hyperApi = new HyperAPI(
	driver,
	new URL('hyper-api', import.meta.url).pathname,
).onBeforeRouter(() => {
	return {
		foo: 123,
	};
});
