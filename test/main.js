/* eslint-disable jsdoc/require-jsdoc */

import { deepStrictEqual } from 'node:assert/strict';
import {
	describe,
	it      }              from 'mocha';

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

	return response.getResponse();
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
			{
				message: 'Hello, world!',
			},
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
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		);
	});

	it('missing arguments', async () => {
		deepStrictEqual(
			await request('echo'),
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		);
	});

	it('api error', async () => {
		deepStrictEqual(
			await request('error.api'),
			{
				code: 10,
				description: 'Endpoint is busy',
			},
		);
	});

	it('internal error', async () => {
		deepStrictEqual(
			await request('error.internal'),
			{
				code: 3,
				description: 'Internal error',
			},
		);
	});

	it('unknown method', async () => {
		deepStrictEqual(
			await request('error.unknown-method'),
			{
				code: 5,
				description: 'Unknown method called',
			},
		);
	});
});
