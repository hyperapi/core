import { expectTypeOf, test } from 'vitest';
import { EmptyObject } from './record.js';
import { Extend } from './types.js';

test('Extend', () => {
	// type T = Extend<{ a: string }, { b: number }>;
	expectTypeOf<Extend<{ a: string }, { b: number }>>().toEqualTypeOf<{
		a: string;
		b: number;
	}>();

	expectTypeOf<Extend<{ a: string }, { a: number }>>().toEqualTypeOf<{
		a: number;
	}>();

	expectTypeOf<Extend<{ a: string }, EmptyObject>>().toEqualTypeOf<{
		a: string;
	}>();

	expectTypeOf<Extend<EmptyObject, { a: string }>>().toEqualTypeOf<{
		a: string;
	}>();

	// type T = Extend<EmptyObject, EmptyObject>;
	expectTypeOf<Extend<EmptyObject, EmptyObject>>().toEqualTypeOf<EmptyObject>();

	// type T = Extend<{ a: string }, never>;
	expectTypeOf<Extend<{ a: string }, never>>().toEqualTypeOf<{
		a: string;
	}>();

	expectTypeOf<Extend<never, { a: string }>>().toEqualTypeOf<{
		a: string;
	}>();

	// type T = Extend<{ a: string }, void>;
	expectTypeOf<Extend<{ a: string }, void>>().toEqualTypeOf<{ a: string }>();
});
