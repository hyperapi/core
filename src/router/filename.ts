const RE_OPTIONAL_CATCH_ALL = /^\[\[\.\.\.(?<key>[a-z_][\da-z_]*)\]\]$/iu;
const RE_GREEDY = /^\[\.\.\.(?<key>[a-z_][\da-z_]*)\]$/iu;

type ParsedFilename = {
	self?: boolean;
	route?: {
		part: string;
		specificity: {
			type: number;
			static_length: number;
		};
	};
};

/**
 * Returns specificity for route.
 *
 * Values:
 * - 0: static route (e.g. `/foo`)
 * - 1: route with parameter (e.g. `/foo-:id`)
 * - 2: route with optional parameter (e.g. `/foo-:id?`)
 * - 3: route with greedy parameter (e.g. `/foo-:id+`)
 * - 4: (NOT USED) route with wildcard (e.g. `/*`)
 * @param name -
 * @returns -
 */
export function parseFilename(name: string): ParsedFilename {
	if (name === 'index' || name.length === 0) {
		return {
			self: true,
		};
	}

	// Optional catch-all uses double brackets [[...slug]]
	const match_optional_catch_all = RE_OPTIONAL_CATCH_ALL.exec(name);
	if (match_optional_catch_all) {
		// We return a sentinel; caller will produce both '/base' and '/base/:slug+'
		return {
			self: true,
			route: {
				part: `:${match_optional_catch_all.groups?.key}+`,
				specificity: {
					type: 3,
					static_length: 0,
				},
			},
		};
	}

	// Greedy: [...slug] -> :slug+
	const match_greedy = RE_GREEDY.exec(name);
	if (match_greedy) {
		return {
			route: {
				part: `:${match_greedy.groups?.key}+`,
				specificity: {
					type: 3,
					static_length: 0,
				},
			},
		};
	}

	let has_optional = false;
	let static_length = name.length;
	const route_part = name.replaceAll(
		// eslint-disable-next-line prefer-named-capture-group
		/(\[([a-z_][\da-z_]*)\]|\[\[([a-z_][\da-z_]*)\]\])([^\da-z_]|$)/giu,
		(...args) => {
			static_length -= args[1].length;

			if (args[3] !== undefined) {
				has_optional = true;
				return `:${args[3]}?${args[4]}`;
			}

			return `:${args[2]}${args[4]}`;
		},
	);

	// something was replaced
	if (name !== route_part) {
		return {
			route: {
				part: route_part,
				specificity: {
					type: has_optional ? 2 : 1,
					static_length,
				},
			},
		};
	}

	if (name.includes('[') !== true) {
		return {
			route: {
				part: route_part,
				specificity: {
					type: 0,
					static_length: 0,
				},
			},
		};
	}

	throw new Error(`Invalid filename "${name}".`);
}
