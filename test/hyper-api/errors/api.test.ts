
import {
	expect,
	test,
} from 'vitest';
import { driver } from '../../setup';

test('error', async () => {
	const result = await driver.trigger(
		'GET',
		'errors/api',
	);

	expect(result).toStrictEqual([
		false,
		{
			code: 10,
			description: 'Endpoint is busy',
		},
	]);
});

test('error with data', async () => {
	const result = await driver.trigger(
		'GET',
		'errors/api',
		{
			error_data: {
				foo: 'bar',
			},
		},
	);

	expect(result).toStrictEqual([
		false,
		{
			code: 10,
			description: 'Endpoint is busy',
			data: {
				foo: 'bar',
			},
		},
	]);
});
