import { expect, test } from 'vitest';
import { driver } from '../setup.js';

test('GET', async () => {
	const result = await driver.trigger('GET', 'only-get');

	expect(result).toStrictEqual([
		true,
		{
			foo: 'bar',
		},
	]);
});

// TODO uncomment this test when HyperAPIMethodNotAllowedError supported
// test('POST', async () => {
// 	const result = await driver.trigger(
// 		'POST',
// 		'only-get',
// 		{},
// 		true,
// 	);

// 	expect(result).toStrictEqual([
// 		false,
// 		{
// 			code: 5,
// 			description: 'Unknown method called',
// 		},
// 		{
// 			status: 405,
// 		},
// 	]);
// });
