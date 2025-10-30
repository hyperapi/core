import { readdirSync } from 'node:fs';
import nodePath from 'node:path';
import type { HyperAPIMethod } from '../utils/methods.js';
import { parseFilename } from './filename.js';

const RE_EXT = /\.([cm]?[jt]s)$/i;
const RE_METHOD = /\.(delete|get|head|options|patch|post|put)$/i;

type WalkState = {
	route: string | null;
	specificity: WalkSpecificity;
};
enum WalkSpecificityPosition {
	FILE_METHOD = 0,
	FILE_ALL = 1,
	DIRECTORY = 2,
}
type WalkSpecificity = {
	type: number;
	static_length: number;
	position: WalkSpecificityPosition;
};
type WalkRoute = {
	specificity: WalkSpecificity;
	method: Lowercase<Exclude<HyperAPIMethod, 'UNKNOWN'>> | 'all';
	route: string;
	path: string;
};
type WalkDirectory = {
	specificity: WalkSpecificity;
	children: WalkResult;
};
export type WalkResult = (WalkRoute | WalkDirectory)[];

/**
 * Reads the file system and returns a tree of routes sorted correctly.
 * @param path_given The directory to read.
 * @param _state Internal state.
 * @returns -
 */
export function readFiles(path_given: string, _state?: WalkState): WalkResult {
	_state ??= {
		route: null,
		specificity: {
			type: 0,
			static_length: 0,
			position: WalkSpecificityPosition.DIRECTORY,
		},
	};

	const result_directory: WalkDirectory = {
		specificity: _state.specificity,
		children: [],
	};
	const result_routes: WalkRoute[] = [];

	const entries = readdirSync(path_given, {
		withFileTypes: true,
	});
	// shuffle response if we are running tests
	// different filesystems may have different ordering in response
	if (process.env.NODE_ENV === 'test') {
		for (let i = entries.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
			[entries[i], entries[j]] = [entries[j]!, entries[i]!]; // swap elements
		}
	}

	for (const entry of entries) {
		const path = nodePath.join(entry.parentPath, entry.name);

		if (entry.isFile()) {
			let name = entry.name.replace(RE_EXT, '');

			if (name.endsWith('.test')) {
				continue;
			}

			let method: WalkRoute['method'] = 'all';
			name = name.replace(RE_METHOD, (_, g1) => {
				method = g1.toLowerCase() as WalkRoute['method'];
				return '';
			});

			const { self, route } = parseFilename(name);
			const specificity_position =
				method === 'all'
					? WalkSpecificityPosition.FILE_ALL
					: WalkSpecificityPosition.FILE_METHOD;

			if (self) {
				result_routes.push({
					specificity: {
						..._state.specificity,
						position: specificity_position,
					},
					method,
					route: _state.route ?? '/',
					path,
				});
			}

			if (route) {
				result_directory.children.push({
					specificity: {
						...route.specificity,
						position: specificity_position,
					},
					method,
					route: (_state.route ?? '') + nodePath.sep + route.part,
					path,
				});
			}
		} else if (entry.isDirectory()) {
			const { self, route } = parseFilename(entry.name);
			if (self) {
				throw new Error(
					`Invalid directory name "${entry.name}" at "${path}". Can not use optional catch-all in directory name.`,
				);
			}

			if (!route) {
				throw new Error(`Invalid directory name "${entry.name}" at "${path}".`);
			}

			result_directory.children.push(
				...readFiles(path, {
					route: (_state.route ?? '') + nodePath.sep + route.part,
					specificity: {
						...route.specificity,
						position: WalkSpecificityPosition.DIRECTORY,
					},
				}),
			);
		}
	}

	sortRoutes(result_directory.children);

	const result = [result_directory, ...result_routes];
	// sort result itself if we are at the root
	// otherwise, sort will be done by the parent
	if (_state.route === null) {
		sortRoutes(result);
	}

	return result;
}

/**
 * Sorts the routes in the given result.
 * @param result The result to sort.
 */
function sortRoutes(result: WalkResult) {
	result.sort((a, b) => {
		if (a.specificity.type !== b.specificity.type) {
			return a.specificity.type - b.specificity.type;
		}

		if (a.specificity.static_length !== b.specificity.static_length) {
			return b.specificity.static_length - a.specificity.static_length;
		}

		if (a.specificity.position !== b.specificity.position) {
			return a.specificity.position - b.specificity.position;
		}

		return 0;
	});
}
