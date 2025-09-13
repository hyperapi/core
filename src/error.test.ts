/* eslint-disable @typescript-eslint/no-explicit-any */

import { expect, test } from 'vitest';
import { HyperAPIBusyError } from './api-errors.js';
import { HyperAPIError } from './error.js';

test('data', () => {
	const error = new HyperAPIBusyError({
		foo: 'bar',
	});
	expect(error.data?.foo).toBe('bar');
});

class HyperAPICustomError extends HyperAPIError<any> {
	code = 1001;
	description = 'This is a custom error';
}

test('custom error', () => {
	const error = new HyperAPICustomError();
	expect(error.message).toBe('This is a custom error (code 1001).');
});
