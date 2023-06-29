
import HyperAPIDriver  from '../src/driver.js';
import HyperAPI        from '../src/main.js';
import HyperAPIRequest from '../src/request.js';

const driver = new HyperAPIDriver();
const api = new HyperAPI({
	driver,
	root: new URL('api', import.meta.url).pathname,
});

const response = await driver.onRequest(
	new HyperAPIRequest(
		process.argv[2],
		{
			name: 'world',
		},
	),
);
console.log('response =', response);
console.log('response =', response.array());
