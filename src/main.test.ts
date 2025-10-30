// oxlint-disable max-lines-per-function, max-nested-callbacks

import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import { HyperAPITestDriver, type TestRequest } from '../test/driver.js';
import { HyperAPI } from './main.js';
import type { HyperAPIResponse } from './response.js';

test('HyperAPI constructor', () => {
	const driver = new HyperAPITestDriver();
	const hyperApi = new HyperAPI(
		driver,
		new URL('../test/hyper-api', import.meta.url).pathname,
	);

	expect(hyperApi).toBeInstanceOf(HyperAPI);

	hyperApi.destroy();
	driver.destroy();
});

describe('hooks', () => {
	describe('onBeforeRouter', () => {
		test('run & pass props', async () => {
			const mockFnFirst = vi.fn(() => null);
			const mockFnSecond = vi.fn(() => null);

			const driver = new HyperAPITestDriver();
			const hyperApi = new HyperAPI(
				driver,
				new URL('../test/hyper-api', import.meta.url).pathname,
			)
				.onBeforeRouter((request) => {
					expectTypeOf(request).toExtend<TestRequest>();
					expectTypeOf(request.foo).toBeString();

					mockFnFirst();

					return { external: 1 };
				})
				.onBeforeRouter((request) => {
					expectTypeOf(request).toExtend<TestRequest>();
					expectTypeOf(request.external).toBeNumber();

					mockFnSecond();

					expect(request.external).toBe(1);
				});

			expect(hyperApi).toBeInstanceOf(HyperAPI);

			const [success, response] = await driver.trigger('GET', '/module/main');
			expect(success).toBe(true);
			expect(response).toStrictEqual({
				external: 1,
			});

			expect(mockFnFirst).toHaveBeenCalledOnce();
			expect(mockFnSecond).toHaveBeenCalledOnce();

			hyperApi.destroy();
			driver.destroy();
		});

		test('throw', async () => {
			const mockFn = vi.fn(() => null);

			const driver = new HyperAPITestDriver();
			const hyperApi = new HyperAPI(
				driver,
				new URL('../test/hyper-api', import.meta.url).pathname,
			).onBeforeRouter((request) => {
				expectTypeOf(request).toExtend<TestRequest>();
				expectTypeOf(request.foo).toBeString();

				mockFn();

				throw new Error('test');
			});

			const [success, response] = await driver.trigger('GET', '/router');
			expect(success).toBe(false);
			expect(response).toStrictEqual({
				code: 3,
				description: 'Internal error',
			});

			expect(mockFn).toHaveBeenCalledOnce();

			hyperApi.destroy();
			driver.destroy();
		});
	});

	describe('onResponse', () => {
		test('run at once', async () => {
			const mockFnFirst = vi.fn(() => Date.now());
			let valueFirst: number = Number.NEGATIVE_INFINITY;
			const mockFnSecond = vi.fn(() => Date.now());
			let valueSecond: number = Number.POSITIVE_INFINITY;

			const driver = new HyperAPITestDriver();
			const hyperApi = new HyperAPI(
				driver,
				new URL('../test/hyper-api', import.meta.url).pathname,
			)
				.onResponse(async (request) => {
					expectTypeOf(request).toExtend<TestRequest>();
					expectTypeOf(request.foo).toBeString();
					expectTypeOf(request.response).toEqualTypeOf<HyperAPIResponse>();
					expect(request.response).toStrictEqual({
						path: 'router/index.get.ts',
						method: 'GET',
						args: {},
					});

					valueFirst = mockFnFirst();

					await new Promise((resolve) => {
						setTimeout(resolve, 100);
					});
				})
				.onResponse((request) => {
					expectTypeOf(request).toExtend<TestRequest>();
					expectTypeOf(request.foo).toBeString();
					expectTypeOf(request.response).toEqualTypeOf<HyperAPIResponse>();
					expect(request.response).toStrictEqual({
						path: 'router/index.get.ts',
						method: 'GET',
						args: {},
					});

					valueSecond = mockFnSecond();
				});

			expect(hyperApi).toBeInstanceOf(HyperAPI);
			const [success] = await driver.trigger('GET', '/router');
			expect(success).toBe(true);
			expect(mockFnFirst).toHaveBeenCalledOnce();
			expect(mockFnSecond).toHaveBeenCalledOnce();
			expect(valueSecond - valueFirst).toBeLessThanOrEqual(100);

			hyperApi.destroy();
			driver.destroy();
		});

		describe('throw', () => {
			test('sync', async () => {
				const mockFn = vi.fn(() => null);

				const driver = new HyperAPITestDriver();
				const hyperApi = new HyperAPI(
					driver,
					new URL('../test/hyper-api', import.meta.url).pathname,
				).onResponse(() => {
					mockFn();
					throw new Error('test');
				});

				const [success] = await driver.trigger('GET', '/router');
				expect(success).toBe(true);

				expect(mockFn).toHaveBeenCalledOnce();

				hyperApi.destroy();
				driver.destroy();
			});

			test('async', async () => {
				const mockFn = vi.fn(() => null);

				const driver = new HyperAPITestDriver();
				const hyperApi = new HyperAPI(
					driver,
					new URL('../test/hyper-api', import.meta.url).pathname,
				).onResponse(async () => {
					await Promise.resolve();
					mockFn();
					throw new Error('test');
				});

				const [success] = await driver.trigger('GET', '/router');
				expect(success).toBe(true);

				expect(mockFn).toHaveBeenCalledOnce();

				hyperApi.destroy();
				driver.destroy();
			});
		});
	});
});
