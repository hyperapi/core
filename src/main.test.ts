import { afterAll, describe, expect, test } from 'vitest';
import { driver, hyperApi } from '../test/setup.js';

afterAll(() => {
	hyperApi.destroy();
});

describe('routing', () => {
	describe('methods', () => {
		test('ALL with GET', async () => {
			const result = await driver.trigger('GET', 'echo', {
				name: 'world',
			});

			expect(result).toStrictEqual([
				true,
				{
					method: {
						expected: 'ALL',
						received: 'GET',
					},
					message: 'Hello, world!',
				},
			]);
		});

		test('ALL with DELETE', async () => {
			const result = await driver.trigger('DELETE', 'echo', {
				name: 'world',
			});

			expect(result).toStrictEqual([
				true,
				{
					method: {
						expected: 'ALL',
						received: 'DELETE',
					},
					message: 'Hello, world!',
				},
			]);
		});

		test('POST', async () => {
			const result = await driver.trigger('POST', 'echo', {
				name: 'deadbeef',
			});

			expect(result).toStrictEqual([
				true,
				{
					method: {
						expected: 'POST',
						received: 'POST',
					},
					message: 'Hello, deadbeef!',
				},
			]);
		});
	});

	describe('slug', () => {
		test('in the file name', async () => {
			const result = await driver.trigger('GET', 'echo-deadbeef');

			expect(result).toStrictEqual([
				true,
				{
					method: {
						expected: 'ALL',
						received: 'GET',
					},
					message: 'Hello, deadbeef!',
				},
			]);
		});

		test('in the directory name', async () => {
			const result = await driver.trigger('POST', 'user', {
				name: 'bax',
			});

			expect(result).toStrictEqual([
				true,
				{
					method: {
						expected: 'POST',
						received: 'POST',
					},
					message: 'Hello, bax!',
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
