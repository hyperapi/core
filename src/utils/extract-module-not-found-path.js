
import {
	dirname,
	join as joinPath } from 'node:path';

// typedef does not work for some reason.

// /**
//  * @typedef {Error} ModuleNotFoundError
//  * @property {'ERR_MODULE_NOT_FOUND'} code The error code.
//  * @property {string} [specifier] - Path to the module that was not found.
//  */
class ModuleNotFoundError extends Error {
	/** @type {string} */
	code = 'ERR_MODULE_NOT_FOUND';
	/** @type {string | undefined} */
	specifier;
	/** @type {string | URL | undefined} */
	url;
}

const REGEXP_MODULE_SPECIFIER = /Cannot find module ["'](.+)["'] (?:imported\s)?from/;
const REGEXP_MODULE_REQUESTER = /\s(?:imported\s)?from ["'](.+)["']/;

/**
 * Extracts path from error as is.
 * @param {ModuleNotFoundError} error The error.
 * @returns {string} The path to the module that was not found.
 */
function extractPath(error) {
	// Bun
	if (typeof error.specifier === 'string') {
		return error.specifier;
	}

	// Node 20.6 ... 20.7
	if (error.url instanceof URL) {
		return error.url.pathname;
	}

	// Node 20.8+
	if (typeof error.url === 'string') {
		return new URL(error.url).pathname;
	}

	const match = error.message.match(REGEXP_MODULE_SPECIFIER);
	if (match !== null) {
		return match[1];
	}

	throw error;
}

/**
 * Extracts the path to module-not-found from an ERR_MODULE_NOT_FOUND error.
 * @param {ModuleNotFoundError} error The error.
 * @returns {string} The path to the module that was not found.
 */
export function extractModuleNotFoundPath(error) {
	const path = extractPath(error);

	if (path.startsWith('/')) {
		return path;
	}

	// Bun returns relative paths, so we have to extract path to the module that requested the missing module from the error message.
	const match = error.message.match(REGEXP_MODULE_REQUESTER);
	if (match !== null) {
		const specifier_from = match[1];

		return joinPath(
			dirname(specifier_from),
			path,
		);
	}

	throw error;
}
