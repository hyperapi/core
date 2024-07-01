/* global Bun */

import {
	beforeAll,
	describe,
	test,
	expect } from 'vitest';

const IMAGES = [
	// no fields, extracting path from message
	'node:14-slim',
	'node:16-slim',
	'node:18-slim',
	'node:20.0-slim',
	'node:20.4-slim',
	// field "url" as an instance of URL
	'node:20.6-slim',
	// field "url" as string
	'node:20.8-slim',
	'node:22-slim',
	// bun
	'oven/bun:1.0',
	'oven/bun:1.1.0-slim',
	'oven/bun:1.1.17-slim',
];

beforeAll(async () => {
	let count = 0;

	await Promise.all(
		IMAGES.map((image) => (async () => {
			const proc = Bun.spawn([
				'docker',
				'pull',
				image,
			]);

			await proc.exited;

			console.log('pulled', image, `(${++count} of ${IMAGES.length})`);
		})()),
	);
});

const PATHS = [
	{
		title: 'existing module imports non-existing module',
		path: './dependency.mjs',
		path_expect: '/app/test/err_module_not_found/test.js',
	},
	{
		title: 'requested module itself does not exist',
		path: './not-exists.mjs',
		path_expect: '/app/test/err_module_not_found/not-exists.mjs',
	},
];

// const ROOT_DIRECTORY = process.cwd();
// console.log('ROOT_DIRECTORY', ROOT_DIRECTORY);

for (const { title, path, path_expect } of PATHS) {
	describe(title, () => {
		for (const image of IMAGES) {
			const args = [
				'docker',
				'run',
				'--rm',
				'-v',
				`${process.cwd()}:/app`,
				'-w',
				'/app',
				image,
				'test/err_module_not_found/main.mjs',
			];

			test(image, async () => {
				const proc = Bun.spawn([
					...args,
					path,
				]);

				await proc.exited;

				expect(proc.exitCode).toBe(0);

				const stdout = await new Response(proc.stdout).text();
				const path_received = stdout.trim();

				expect(path_received).toBe(path_expect);
			});
		}
	});
}
