import { describe, expect, test } from 'vitest';
import { driver } from './server.js';

describe('action', () => {
	test('async', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/async');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ foo: 1 });
	});

	test('returns void', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/void');
		expect(status).toBe(true);
		expect(data).toBeUndefined();
	});
});

describe('use', () => {
	test('single', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/use');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 1 });
	});

	test('async', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/use/async');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 1 });
	});

	test('multiple', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/use/multiple');
		expect(status).toBe(true);
		expect(data).toStrictEqual({
			extra: [1, 2],
		});
	});

	test('override', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/use/override');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 2 });
	});

	test('error', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/use/error');
		expect(status).toBe(false);
		expect(data).toStrictEqual({
			code: 2,
			description: 'One of the parameters specified was missing or invalid',
		});
	});
});

describe('set', () => {
	test('single', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/set');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 1 });
	});

	test('async', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/set/async');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 1 });
	});

	test('multiple', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/set/multiple');
		expect(status).toBe(true);
		expect(data).toStrictEqual({
			extra: [1, 2],
		});
	});

	test('override', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/set/override');
		expect(status).toBe(true);
		expect(data).toStrictEqual({ extra: 2 });
	});

	test('error', async () => {
		const [status, data] = await driver.trigger('UNDEF', 'module/set/error');
		expect(status).toBe(false);
		expect(data).toStrictEqual({
			code: 2,
			description: 'One of the parameters specified was missing or invalid',
		});
	});
});
