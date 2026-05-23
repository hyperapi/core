import { readdirSync } from 'node:fs';
import nodePath from 'node:path';
import { type HyperAPIMethod, isHyperApiMethod } from '../dev.js';
import type { HyperAPIRouteData } from '../router.js';
import { parseFilename } from './filename.js';

const RE_EXT = /\.(?<ext>[cm]?[jt]s)$/iu;
const RE_METHOD = /\.(?<method>delete|get|options|patch|post|put)$/iu;

type WalkState = {
	path: string;
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
	route_data: HyperAPIRouteData;
};
type WalkDirectory = {
	specificity: WalkSpecificity;
	children: WalkResult;
};
export type WalkResult = (WalkRoute | WalkDirectory)[];

/**
 * Returns the routes for the given path.
 * @param path The path to read files from.
 * @returns The routes for the given path.
 */
// oxlint-disable-next-line max-lines-per-function
export function getRoutes(path: string): HyperAPIRouteData[] {
	const route_datas: HyperAPIRouteData[] = [];

	(function walk(walk_state: WalkState) {
		const result_directory: WalkDirectory = {
			specificity: walk_state.specificity,
			children: [],
		};
		const result_routes: WalkRoute[] = [];

		const entries = readdirSync(walk_state.path, {
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
			const entry_path = nodePath.join(entry.parentPath, entry.name);

			if (entry.isFile()) {
				let name = entry.name.replace(RE_EXT, '');

				if (name.endsWith('.test')) {
					continue;
				}

				let method: HyperAPIMethod = 'UNDEF';
				name = name.replace(RE_METHOD, (_, g1) => {
					const value = g1.toUpperCase();
					if (isHyperApiMethod(value) !== true) {
						throw new Error(`Internal error: invalid method: ${value}`);
					}

					method = value;
					return '';
				});

				const { self, route } = parseFilename(name);
				const specificity_position = WalkSpecificityPosition.FILE_METHOD;

				if (self) {
					result_routes.push({
						specificity: {
							...walk_state.specificity,
							position: specificity_position,
						},
						route_data: {
							method,
							route: walk_state.route ?? '/',
							file_path: entry_path,
						},
					});
				}

				if (route) {
					result_directory.children.push({
						specificity: {
							...route.specificity,
							position: specificity_position,
						},
						route_data: {
							method,
							route: (walk_state.route ?? '') + nodePath.sep + route.part,
							file_path: entry_path,
						},
					});
				}
			} else if (entry.isDirectory()) {
				const { self, route } = parseFilename(entry.name);
				if (self) {
					throw new Error(
						`Invalid directory name "${entry.name}" at "${entry_path}". Can not use optional catch-all in directory name.`,
					);
				}

				if (!route) {
					throw new Error(
						`Invalid directory name "${entry.name}" at "${entry_path}".`,
					);
				}

				result_directory.children.push(
					...walk({
						path: entry_path,
						route: (walk_state.route ?? '') + nodePath.sep + route.part,
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
		if (walk_state.route === null) {
			sortRoutes(result);
		}

		for (const result_item of result_directory.children) {
			if ('route_data' in result_item) {
				route_datas.push(result_item.route_data);
			}
		}

		return result;
	})({
		path,
		route: null,
		specificity: {
			type: 0,
			static_length: 0,
			position: WalkSpecificityPosition.DIRECTORY,
		},
	});

	return route_datas;
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
