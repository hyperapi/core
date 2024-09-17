/* eslint-disable n/no-sync */

import {
	IttyRouter,
	type IRequest,
	type IttyRouterType,
}                        from 'itty-router';
import { readdirSync }   from 'node:fs';
import nodePath          from 'node:path';
import { HTTPMethod } from './utils/types';

/**
 * Creates new IttyRouter from filesystem.
 * @param path The path to scan.
 * @returns The new IttyRouter.
 */
export function createRouter(path: string) {
	// eslint-disable-next-line new-cap
	const router = IttyRouter();

	scanDirectory(router, path);

	return router;
}

interface RouterResponse {
	module_path: string;
	args: Record<string, unknown>;
}

/**
 * Fetches data from router.
 * @param router The router to fetch data from.
 * @param method The HTTP method.
 * @param path The path to fetch data from.
 * @returns The response.
 */
export function useRouter(
	router: IttyRouterType<IRequest, unknown[], unknown>,
	method: HTTPMethod,
	path: string,
) {
	return router.fetch({
		method,
		url: `file://${path}`,
	}) as Promise<RouterResponse | undefined>;
}

const REGEXP_FILE_EXTENSION = /\.(js|mjs|cjs|ts)$/;
const REGEXP_HTTP_METHOD = /\.\[(delete|get|head|options|patch|post|put)]$/;
const REGEXP_PATH_SLUG = /\[(\w+)]/g;

interface Route {
	method: Lowercase<Exclude<HTTPMethod, 'UNKNOWN'>> | 'all';
	path: string;
	module_path: string;
}

/**
 * Scans directory for routes.
 * @param router The router to add routes to.
 * @param path The path to scan.
 * @param [regexp_parts] The parts of the regular expression.
 */
function scanDirectory(
	router: IttyRouterType<IRequest, unknown[], unknown>,
	path: string,
	regexp_parts: string[] = [ '' ],
) {
	const result = readdirSync(
		path,
		{
			withFileTypes: true,
		},
	);

	const routes: Record<string, Route[]> = {
		0: [], // routes with no method and no slug
		1: [], // routes with method and no slug
		2: [], // routes with no method and slug
		3: [], // routes with method and slug
	};

	for (const entry of result) {
		const entry_path = nodePath.join(
			path,
			entry.name,
		);

		if (entry.isFile()) {
			let file_name = entry.name;
			if (REGEXP_FILE_EXTENSION.test(file_name)) {
				file_name = file_name.replace(
					REGEXP_FILE_EXTENSION,
					'',
				);

				let method: Route['method'] = 'all';
				const method_match = file_name.match(REGEXP_HTTP_METHOD);
				const has_method = method_match ? 1 : 0;
				if (method_match) {
					method = method_match[1] as Exclude<Route['method'], 'all'>;

					file_name = file_name.replace(
						REGEXP_HTTP_METHOD,
						'',
					);
				}

				const has_slug = REGEXP_PATH_SLUG.test(file_name) ? 2 : 0;
				file_name = file_name.replaceAll(
					REGEXP_PATH_SLUG,
					':$1',
				);

				// console.log(
				// 	entry_path,
				// 	method,
				// 	[
				// 		...regexp_parts,
				// 		file_name,
				// 	].join(nodePath.sep),
				// );

				// eslint-disable-next-line no-bitwise
				routes[has_method | has_slug].push({
					method,
					path: [
						...regexp_parts,
						file_name,
					].join(nodePath.sep),
					module_path: entry_path,
				});
			}
		}
		else {
			scanDirectory(
				router,
				entry_path,
				[
					...regexp_parts,
					entry.name.replaceAll(
						REGEXP_PATH_SLUG,
						':$1',
					),
				],
			);
		}
	}

	for (
		const route of [
			...routes[1],
			...routes[3],
			...routes[0],
			...routes[2],
		]
	) {
		router[route.method](
			route.path,
			(r) => {
				const response: RouterResponse = {
					module_path: route.module_path,
					args: r.params,
				};

				return response;
			},
		);
	}
}
