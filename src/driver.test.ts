import type { EmptyObject } from 'type-fest';
import { describe, expect, expectTypeOf, test } from 'vitest';
import { HyperAPIDriver } from './driver.js';
import { HyperAPI } from './main.js';
import type { HyperAPIModuleResponse } from './module.js';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';

const ROOT = new URL('../test/hyper-api', import.meta.url).pathname;

/** A transport that carries plain JSON only — the core floor. */
class NarrowDriver extends HyperAPIDriver {}

type WideResponse = HyperAPIModuleResponse | Response;

/** A transport that can also carry a raw `Response`. */
class WideDriver extends HyperAPIDriver<HyperAPIRequest, WideResponse> {
	override isValidResponse(response: unknown): response is WideResponse {
		return response instanceof Response || super.isValidResponse(response);
	}
}

describe('isValidResponse', () => {
	test('the floor', () => {
		const driver = new NarrowDriver();

		expect(driver.isValidResponse(undefined)).toBe(true);
		expect(driver.isValidResponse({})).toBe(true);
		expect(driver.isValidResponse({ foo: 1 })).toBe(true);
		expect(driver.isValidResponse([1, 2])).toBe(true);

		expect(driver.isValidResponse(new Response())).toBe(false);
		expect(driver.isValidResponse('string')).toBe(false);
		expect(driver.isValidResponse(1)).toBe(false);
		expect(driver.isValidResponse(null)).toBe(false);

		driver.destroy();
	});

	test('widened by a driver', () => {
		const driver = new WideDriver();

		expect(driver.isValidResponse(new Response())).toBe(true);
		expect(driver.isValidResponse({ foo: 1 })).toBe(true);
		expect(driver.isValidResponse(undefined)).toBe(true);
		expect(driver.isValidResponse('string')).toBe(false);

		driver.destroy();
	});
});

describe('response type', () => {
	test('is inferred from the driver', () => {
		const driver = new WideDriver();
		const hyperApi = new HyperAPI(driver, ROOT);

		expectTypeOf(hyperApi).toEqualTypeOf<
			HyperAPI<HyperAPIRequest, EmptyObject, WideResponse>
		>();

		hyperApi.destroy();
		driver.destroy();
	});

	test('survives hook chaining', () => {
		const driver = new WideDriver();
		const hyperApi = new HyperAPI(driver, ROOT)
			.onBeforeRouter(() => {
				return { trace: 'x' };
			})
			.onResponse((request) => {
				expectTypeOf(request.response).toEqualTypeOf<
					HyperAPIResponse<WideResponse>
				>();
			});

		expectTypeOf(hyperApi).toEqualTypeOf<
			HyperAPI<HyperAPIRequest, EmptyObject & { trace: string }, WideResponse>
		>();

		hyperApi.destroy();
		driver.destroy();
	});

	test('constrains action', () => {
		const narrow = new NarrowDriver();
		const wide = new WideDriver();
		const narrowApi = new HyperAPI(narrow, ROOT);
		const wideApi = new HyperAPI(wide, ROOT);

		wideApi.module().action(() => new Response('ok'));

		narrowApi.module().action(
			// @ts-expect-error -- this transport cannot carry a Response
			() => new Response('ok'),
		);

		// both still accept the floor
		wideApi.module().action(() => {
			return { foo: 1 };
		});
		narrowApi.module().action(() => {
			return { foo: 1 };
		});

		narrowApi.destroy();
		wideApi.destroy();
		narrow.destroy();
		wide.destroy();
	});
});
