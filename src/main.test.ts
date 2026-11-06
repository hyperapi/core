// oxlint-disable max-lines-per-function, max-nested-callbacks

import { AsyncLocalStorage } from 'node:async_hooks';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import { HyperAPITestDriver, type TestRequest } from '../test/driver.js';
import { HyperAPI } from './main.js';
import type { HyperAPIResponse } from './response.js';

/**
 * Creates an API with the given `wrapRequest` hook and a mock that counts pipeline runs.
 * @param fn - The `wrapRequest` hook.
 * @returns -
 */
function createWrappedApi(
	fn: Parameters<HyperAPI<TestRequest>['wrapRequest']>[0],
) {
	const mockPipeline = vi.fn();
	const driver = new HyperAPITestDriver();
	const hyperApi = new HyperAPI(
		driver,
		new URL('../test/hyper-api', import.meta.url).pathname,
	)
		.wrapRequest(fn)
		.onResponse(mockPipeline);

	return {
		driver,
		mockPipeline,
		destroy() {
			hyperApi.destroy();
			driver.destroy();
		},
	};
}

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

			const [success, response] = await driver.trigger('UNDEF', '/module/main');
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
			let valueFirst = -Infinity;
			const mockFnSecond = vi.fn(() => Date.now());
			let valueSecond = Infinity;

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
						path: 'router/index+get.ts',
						method: 'GET',
						args: {},
						foo_type: 'string',
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
						path: 'router/index+get.ts',
						method: 'GET',
						args: {},
						foo_type: 'string',
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

	describe('wrapRequest', () => {
		test('runs hooks and module inside the wrapper context', async () => {
			const storage = new AsyncLocalStorage<string>();
			const mockStore = vi.fn();

			const driver = new HyperAPITestDriver();
			const hyperApi = new HyperAPI(
				driver,
				new URL('../test/hyper-api', import.meta.url).pathname,
			)
				.wrapRequest((request, next) => {
					expectTypeOf(request).toExtend<TestRequest>();
					expect(request.path).toBe('/router');

					storage.run('wrapped', next);
				})
				.onBeforeRouter(() => {
					mockStore(storage.getStore());
				})
				.onResponse(() => {
					mockStore(storage.getStore());
				});

			const [success] = await driver.trigger('GET', 'router');
			expect(success).toBe(true);
			expect(mockStore).toHaveBeenCalledTimes(2);
			expect(mockStore).toHaveBeenNthCalledWith(1, 'wrapped');
			expect(mockStore).toHaveBeenNthCalledWith(2, 'wrapped');

			hyperApi.destroy();
			driver.destroy();
		});

		test('keeps void response', async () => {
			const api = createWrappedApi((_request, next) => {
				next();
			});

			const [success, response] = await api.driver.trigger(
				'UNDEF',
				'/module/void',
			);
			expect(success).toBe(true);
			expect(response).toBeUndefined();

			api.destroy();
		});

		test('runs pipeline once when next is called twice', async () => {
			const api = createWrappedApi((_request, next) => {
				next();
				next();
			});

			const [success] = await api.driver.trigger('GET', '/router');
			expect(success).toBe(true);
			expect(api.mockPipeline).toHaveBeenCalledOnce();

			api.destroy();
		});

		test('no next', async () => {
			const api = createWrappedApi(vi.fn());

			const [success, response] = await api.driver.trigger('GET', '/router');
			expect(success).toBe(false);
			expect(response).toStrictEqual({
				code: 3,
				description: 'Internal error',
			});
			expect(api.mockPipeline).not.toHaveBeenCalled();

			api.destroy();
		});

		test('throw before next', async () => {
			const api = createWrappedApi(async () => {
				await Promise.resolve();
				throw new Error('test');
			});

			const [success] = await api.driver.trigger('GET', '/router');
			expect(success).toBe(false);
			expect(api.mockPipeline).not.toHaveBeenCalled();

			api.destroy();
		});

		test('throw after next keeps response', async () => {
			const api = createWrappedApi(async (_request, next) => {
				next();
				await Promise.resolve();
				throw new Error('test');
			});

			const [success] = await api.driver.trigger('GET', '/router');
			expect(success).toBe(true);
			expect(api.mockPipeline).toHaveBeenCalledOnce();

			api.destroy();
		});

		test('next called after wrapper finished is ignored', async () => {
			const api = createWrappedApi((_request, next) => {
				setTimeout(next, 10);
			});

			const [success] = await api.driver.trigger('GET', '/router');
			expect(success).toBe(false);

			await new Promise((resolve) => {
				setTimeout(resolve, 50);
			});
			expect(api.mockPipeline).not.toHaveBeenCalled();

			api.destroy();
		});

		test('second wrapRequest throws', () => {
			const driver = new HyperAPITestDriver();
			const hyperApi = new HyperAPI(
				driver,
				new URL('../test/hyper-api', import.meta.url).pathname,
			).wrapRequest(vi.fn());

			expect(() => hyperApi.wrapRequest(vi.fn())).toThrow();

			hyperApi.destroy();
			driver.destroy();
		});
	});
});
