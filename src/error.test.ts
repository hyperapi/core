/* eslint-disable @typescript-eslint/no-explicit-any */

import { expect, test } from 'vitest';
import { HyperAPIError } from './error.js';

class HyperAPICustomError extends HyperAPIError<any> {
	code = 1001;
	description = 'This is a custom error';
}

test('custom error', () => {
	const error = new HyperAPICustomError();
	expect(error.message).toBe('This is a custom error (code 1001).');
});
