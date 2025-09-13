import { expect, test } from 'vitest';
import { hasCommonKeys, isRecord } from './record.js';

test('isRecord', () => {
	expect(isRecord({})).toBe(true);
	expect(isRecord({ a: 1 })).toBe(true);
	expect(isRecord({ a: 1, b: '2' })).toBe(true);
	expect(isRecord([1, 2, 3])).toBe(false);
	expect(isRecord(null)).toBe(false);
	expect(isRecord(undefined)).toBe(false);
	expect(isRecord(1)).toBe(false);
	expect(isRecord('string')).toBe(false);
	expect(isRecord(true)).toBe(false);
	expect(isRecord(false)).toBe(false);
});

test('hasCommonKeys', () => {
	expect(hasCommonKeys({ a: 1 }, { a: 2 })).toBe(true);
	expect(hasCommonKeys({ a: 1 }, { b: 2 })).toBe(false);
	expect(hasCommonKeys({ a: 1 }, { a: 2, b: 3 })).toBe(true);
	expect(hasCommonKeys({ a: 1 }, { b: 2, c: 3 })).toBe(false);
	expect(hasCommonKeys({ a: 1 }, { a: 2, b: 3, c: 4 })).toBe(true);
	expect(hasCommonKeys({ a: 1 }, { b: 2, c: 3, d: 4 })).toBe(false);
});
