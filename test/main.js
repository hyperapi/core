
import {
	strictEqual,
	notStrictEqual,
	deepStrictEqual }   from 'node:assert/strict';
import { describe, it } from 'mocha';

import HyperAPIDriver  from '../src/driver.js';
import HyperAPI        from '../src/main.js';
import HyperAPIRequest from '../src/request.js';

const driver = new HyperAPIDriver();
const api = new HyperAPI({
	driver,
	root: new URL('api', import.meta.url).pathname,
});

async function request(method, args = {}) {
	const response = await driver.onRequest(
		new HyperAPIRequest(
			method,
			args,
		),
	);

	return response.array();
}

describe('HyperAPI', () => {
	it('correct request', async () => {
		deepStrictEqual(
			await request(
				'echo',
				{
					name: 'world',
				},
			),
			[
				0,
				'Hello, world!',
			],
		);
	});

	it('invalid arguments', async () => {
		deepStrictEqual(
			await request(
				'echo',
				{
					name: 123,
				},
			),
			[
				2,
				'One of the parameters specified was missing or invalid',
			],
		);
	});

	it('missing arguments', async () => {
		deepStrictEqual(
			await request('echo'),
			[
				2,
				'One of the parameters specified was missing or invalid',
			],
		);
	});

	it('api error', async () => {
		deepStrictEqual(
			await request('error.api'),
			[
				10,
				'Endpoint is busy',
			],
		);
	});

	it('internal error', async () => {
		deepStrictEqual(
			await request('error.internal'),
			[
				3,
				'Internal error',
			],
		);
	});

	it('unknown method', async () => {
		deepStrictEqual(
			await request('error.unknown-method'),
			[
				5,
				'Unknown method called',
			],
		);
	});
});
