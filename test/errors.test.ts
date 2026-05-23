import { expect, test } from 'vitest';
import { driver } from './server.js';

test('api', async () => {
	const [success, response] = await driver.trigger('UNDEF', 'errors/api');

	expect(success).toBe(false);
	expect(response).toStrictEqual({
		code: 10,
		description: 'Endpoint is busy',
	});
});

test('internal', async () => {
	const [success, response] = await driver.trigger('UNDEF', 'errors/internal');

	expect(success).toBe(false);
	expect(response).toStrictEqual({
		code: 3,
		description: 'Internal error',
	});
});
