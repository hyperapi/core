
import { extractModuleNotFoundPath } from '../../src/utils/extract-module-not-found-path.js';

try {
	await import(process.argv[2]);

	// eslint-disable-next-line no-process-exit, unicorn/no-process-exit
	process.exit(128);
}
catch (error) {
	console.log(
		extractModuleNotFoundPath(error),
	);
}
