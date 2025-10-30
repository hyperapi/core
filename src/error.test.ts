import { expect, test } from 'vitest';
import { HyperAPIBusyError } from './api-errors.js';
import { HyperAPIError } from './error.js';

test('data', () => {
	const error = new HyperAPIBusyError({
		foo: 'bar',
	});
	expect(error.data?.foo).toBe('bar');
});

// oxlint-disable-next-line typescript/no-explicit-any
class HyperAPICustomError extends HyperAPIError<any> {
	override code = 1001;
	override description = 'This is a custom error';
}

test('custom error', () => {
	const error = new HyperAPICustomError();
	expect(error.message).toBe('This is a custom error (code 1001).');
});
