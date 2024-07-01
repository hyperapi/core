/**
 * Extracts the path to module-not-found from an ERR_MODULE_NOT_FOUND error.
 * @param {ModuleNotFoundError} error The error.
 * @returns {string} The path to the module that was not found.
 */
export function extractModuleNotFoundPath(error: ModuleNotFoundError): string;
declare class ModuleNotFoundError extends Error {
    /** @type {string} */
    code: string;
    /** @type {string | undefined} */
    specifier: string | undefined;
    /** @type {string | URL | undefined} */
    url: string | URL | undefined;
}
export {};
