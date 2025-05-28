import { expect, test } from 'vitest';
import { driver } from '../../setup.js';

test('internal error', async () => {
	const result = await driver.trigger('GET', 'errors/internal');

	expect(result).toStrictEqual([
		false,
		{
			code: 3,
			description: 'Internal error',
		},
	]);
});
