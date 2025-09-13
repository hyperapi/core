import { describe, expect, test } from 'vitest';
import { HyperAPI } from '../src/main.js';
import { HyperAPITestDriver } from './driver.js';
import { driver } from './server.js';

// eslint-disable-next-line jsdoc/require-jsdoc
function repeat(times: number): number[] {
	return Array.from({ length: times }, (_, i) => i);
}

describe('ALL', () => {
	test('with GET', async () => {
		const [success, response] = await driver.trigger('GET', 'router/all');
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/all.ts',
			method: 'GET',
			args: {},
		});
	});

	test('with POST', async () => {
		const [success, response] = await driver.trigger('POST', 'router/all');
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/all.ts',
			method: 'POST',
			args: {},
		});
	});
});

describe('only GET', () => {
	test('with GET', async () => {
		const [success, response] = await driver.trigger('GET', 'router/x');
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/x.get.ts',
			method: 'GET',
			args: {},
		});
	});

	// test('with POST', async () => {
	// 	const [success, response, http] = await driver.trigger(
	// 		'POST',
	// 		'router/x',
	// 	);
	// 	expect(success).toBe(false);
	// 	expect(response).toStrictEqual({
	// 		code: 5,
	// 		description: 'Unknown method called',
	// 	});
	// 	expect(http.status).toBe(405);
	// });
});

test('only method in the filename', async () => {
	const [success, response] = await driver.trigger('GET', 'router');
	expect(success).toBe(true);
	expect(response).toStrictEqual({
		path: 'router/index.get.ts',
		method: 'GET',
		args: {},
	});
});

// rerun tests shuffling files simulating different order of files returned by filesystem
// our router should order files by their name (static, slugs, optional)
describe.each(repeat(10))('slug', () => {
	const driver_slug = new HyperAPITestDriver();
	const _ = new HyperAPI(
		driver_slug,
		new URL('hyper-api', import.meta.url).pathname,
	);

	test('filename with slug in the end', async () => {
		const [success, response] = await driver_slug.trigger(
			'GET',
			'router/slug/x-123',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/slug/x-[slug].ts',
			method: 'GET',
			args: { slug: '123' },
		});
	});

	test('filename with slug in the middle', async () => {
		const [success, response] = await driver_slug.trigger(
			'GET',
			'router/slug/x-123-x',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/slug/x-[slug]-x.ts',
			method: 'GET',
			args: { slug: '123' },
		});
	});

	test('filename with slug only', async () => {
		const [success, response] = await driver_slug.trigger(
			'GET',
			'router/slug/123',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/slug/[slug].ts',
			method: 'GET',
			args: { slug: '123' },
		});
	});

	test('directory with slug only', async () => {
		const [success, response] = await driver_slug.trigger(
			'GET',
			'router/slug/123/x',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/slug/[slug]/x.ts',
			method: 'GET',
			args: { slug: '123' },
		});
	});
});

describe('optional slug', () => {
	describe('filename with slug and optional slug', () => {
		test('pass optional', async () => {
			const [success, response] = await driver.trigger(
				'GET',
				'router/optional-slug/image.png',
			);
			expect(success).toBe(true);
			expect(response).toStrictEqual({
				path: 'router/optional-slug/[name].[[ext]].ts',
				method: 'GET',
				args: { name: 'image', ext: 'png' },
			});
		});

		test('omit optional', async () => {
			const [success, response] = await driver.trigger(
				'GET',
				'router/optional-slug/image',
			);
			expect(success).toBe(true);
			expect(response).toStrictEqual({
				path: 'router/optional-slug/[name].[[ext]].ts',
				method: 'GET',
				args: { name: 'image', ext: undefined },
			});
		});
	});
});

describe('catch all', () => {
	test('0 level deep', async () => {
		const [success, response] = await driver.trigger('GET', 'router/catch');
		expect(success).toBe(false);
		expect(response).toStrictEqual({
			code: 5,
			description: 'Unknown method called',
		});
	});

	test('1 level deep', async () => {
		const [success, response] = await driver.trigger('GET', 'router/catch/foo');
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/catch/[...slug].ts',
			method: 'GET',
			args: { slug: 'foo' },
		});
	});

	test('3 level deep', async () => {
		const [success, response] = await driver.trigger(
			'GET',
			'router/catch/foo/bar/baz',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/catch/[...slug].ts',
			method: 'GET',
			args: { slug: 'foo/bar/baz' },
		});
	});
});

describe('optional catch all', () => {
	test('0 level deep', async () => {
		const [success, response] = await driver.trigger(
			'GET',
			'router/optional-catch',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/optional-catch/[[...slug]].ts',
			method: 'GET',
			args: {},
		});
	});

	test('1 level deep', async () => {
		const [success, response] = await driver.trigger(
			'GET',
			'router/optional-catch/foo',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/optional-catch/[[...slug]].ts',
			method: 'GET',
			args: { slug: 'foo' },
		});
	});

	test('3 level deep', async () => {
		const [success, response] = await driver.trigger(
			'GET',
			'router/optional-catch/foo/bar/baz',
		);
		expect(success).toBe(true);
		expect(response).toStrictEqual({
			path: 'router/optional-catch/[[...slug]].ts',
			method: 'GET',
			args: { slug: 'foo/bar/baz' },
		});
	});
});

describe('errors', () => {
	test('unknown method', async () => {
		const [success, response, http] = await driver.trigger(
			'POST',
			'router/unknown',
		);
		expect(success).toBe(false);
		expect(response).toStrictEqual({
			code: 5,
			description: 'Unknown method called',
		});
		expect(http.status).toBe(404);
	});
});
