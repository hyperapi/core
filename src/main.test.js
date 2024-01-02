
/* global describe, test, expect */
/* eslint-disable jsdoc/require-jsdoc */

import { HyperAPIDriver }  from './driver.js';
import { HyperAPI }        from './main.js';
import { HyperAPIRequest } from './request.js';

const driver = new HyperAPIDriver();
// eslint-disable-next-line no-unused-vars
const api = new HyperAPI({
	driver,
	root: new URL('../test/api', import.meta.url).pathname,
});

async function request(method, args = {}) {
	const response = await driver.onRequest(
		new HyperAPIRequest(
			method,
			args,
		),
	);

	return [
		response.is_success,
		response.getResponse(),
	];
}

describe('HyperAPI', () => {
	test('correct request (sync)', async () => {
		const result = await request(
			'echo',
			{
				name: 'world',
			},
		);

		expect(result).toStrictEqual([
			true,
			{
				message: 'Hello, world!',
			},
		]);
	});

	test('method in directory', async () => {
		const result = await request(
			'dir/nested',
		);

		expect(result).toStrictEqual([
			true,
			{
				ok: true,
			},
		]);
	});

	test('correct request (async)', async () => {
		const result = await request(
			'echo.async',
			{
				name: 'user',
			},
		);

		expect(result).toStrictEqual([
			true,
			{
				message: 'Hello, user!',
			},
		]);
	});

	test('invalid arguments', async () => {
		const result = await request(
			'echo',
			{
				name: 123,
			},
		);

		expect(result).toStrictEqual([
			false,
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		]);
	});

	test('missing arguments', async () => {
		const result = await request('echo');

		expect(result).toStrictEqual([
			false,
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		]);
	});

	test('api error', async () => {
		const result = await request('error.api');

		expect(result).toStrictEqual([
			false,
			{
				code: 10,
				description: 'Endpoint is busy',
			},
		]);
	});

	test('internal error', async () => {
		const result = await request('error.internal');

		expect(result).toStrictEqual([
			false,
			{
				code: 3,
				description: 'Internal error',
			},
		]);
	});

	test('invalid return type', async () => {
		const result = await request('error.type');

		expect(result).toStrictEqual([
			false,
			{
				code: 3,
				description: 'Internal error',
			},
		]);
	});

	test('unknown method', async () => {
		const result = await request('error.unknown-method');

		expect(result).toStrictEqual([
			false,
			{
				code: 5,
				description: 'Unknown method called',
			},
		]);
	});

	test('invalid import path inside module', async () => {
		const result = await request('error.import.path');

		expect(result).toStrictEqual([
			false,
			{
				code: 3,
				description: 'Internal error',
			},
		]);
	});

	test('invalid import field inside module', async () => {
		const result = await request('error.import.field');

		expect(result).toStrictEqual([
			false,
			{
				code: 3,
				description: 'Internal error',
			},
		]);
	});
});
