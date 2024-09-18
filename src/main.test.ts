import {
	afterAll,
	describe,
	test,
	expect,
} from 'vitest';
import {
	driver,
	hyperApi,
} from '../test/setup.js';

afterAll(() => {
	hyperApi.destroy();
});

describe('routing', () => {
	describe('methods', () => {
		test('ALL', async () => {
			const result = await driver.trigger(
				'GET',
				'echo',
				{
					name: 'world',
				},
			);

			expect(result).toStrictEqual([
				true,
				{
					method: 'ALL',
					message: 'Hello, world!',
				},
			]);
		});

		test('POST', async () => {
			const result = await driver.trigger(
				'POST',
				'echo',
				{
					name: 'deadbeef',
				},
			);

			expect(result).toStrictEqual([
				true,
				{
					method: 'POST',
					message: 'Hello, deadbeef!',
				},
			]);
		});
	});

	// test('method in directory', async () => {
	// 	const result = await request(
	// 		'dir/nested',
	// 	);

	// 	expect(result).toStrictEqual([
	// 		true,
	// 		{
	// 			ok: true,
	// 		},
	// 	]);
	// });

	// test('correct request (async)', async () => {
	// 	const result = await request(
	// 		'echo.async',
	// 		{
	// 			name: 'user',
	// 		},
	// 	);

	// 	expect(result).toStrictEqual([
	// 		true,
	// 		{
	// 			message: 'Hello, user!',
	// 		},
	// 	]);
	// });

	// test('invalid arguments', async () => {
	// 	const result = await request(
	// 		'echo',
	// 		{
	// 			name: 123,
	// 		},
	// 	);

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 2,
	// 			description: 'One of the parameters specified was missing or invalid',
	// 		},
	// 	]);
	// });

	// test('missing arguments', async () => {
	// 	const result = await request('echo');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 2,
	// 			description: 'One of the parameters specified was missing or invalid',
	// 		},
	// 	]);
	// });

	// test('api error', async () => {
	// 	const result = await request('error.api');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 10,
	// 			description: 'Endpoint is busy',
	// 		},
	// 	]);
	// });

	// test('internal error', async () => {
	// 	const result = await request('error.internal');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 3,
	// 			description: 'Internal error',
	// 		},
	// 	]);
	// });

	// test('invalid return type', async () => {
	// 	const result = await request('error.type');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 3,
	// 			description: 'Internal error',
	// 		},
	// 	]);
	// });

	// test('unknown method', async () => {
	// 	const result = await request('error.unknown-method');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 5,
	// 			description: 'Unknown method called',
	// 		},
	// 	]);
	// });

	// test('invalid import path inside module', async () => {
	// 	const result = await request('error.import.path');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 3,
	// 			description: 'Internal error',
	// 		},
	// 	]);
	// });

	// test('invalid import field inside module', async () => {
	// 	const result = await request('error.import.field');

	// 	expect(result).toStrictEqual([
	// 		false,
	// 		{
	// 			code: 3,
	// 			description: 'Internal error',
	// 		},
	// 	]);
	// });
});
