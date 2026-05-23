import type { HyperAPIMethod } from './dev.js';
import { HyperAPIError, type HyperAPIErrorData } from './error.js';

export class HyperAPIAuthorizationError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 1;
	override description = 'Authorization error';
	override httpStatus = 401; // Unauthorized
}

export class HyperAPIInvalidParametersError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 2;
	override description =
		'One of the parameters specified was missing or invalid';
	override httpStatus = 400; // Bad Request
}

export class HyperAPIInternalError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 3;
	override description = 'Internal error';
	override httpStatus = 500; // Internal Server Error
}

export class HyperAPIForbiddenError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 4;
	override description = 'You do not have permission to perform this action';
	override httpStatus = 403; // Forbidden
}

export class HyperAPIUnknownMethodError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 5;
	override description = 'Unknown method called';
	override httpStatus = 404; // Not Found
}

export class HyperAPIObjectsLimitError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 6;
	override description = 'Too many objects requested';
	override httpStatus = 400; // Bad Request
}

export class HyperAPIRateLimitError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 7;
	override description = 'Rate limit exceeded';
	override httpStatus = 429; // Too Many Requests
}

export class HyperAPICaptchaError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 8;
	override description = 'Captcha required';
	override httpStatus = 428; // Precondition Required
}

export class HyperAPIBusyError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 10;
	override description = 'Endpoint is busy';
	override httpStatus = 503; // Service Unavailable
}

export class HyperAPIConfirmationError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 11;
	override description = 'Confirmation required';
	override httpStatus = 409; // Conflict
}

export class HyperAPIOTPError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 12;
	override description = 'One-time password required';
	override httpStatus = 401; // Unauthorized
}

export class HyperAPIMaintenanceError<
	D extends HyperAPIErrorData,
> extends HyperAPIError<D> {
	override code = 13;
	override description = 'Endpoint is in maintenance mode';
	override httpStatus = 503; // Service Unavailable
}

export class HyperAPIMethodNotAllowedError extends HyperAPIError {
	override code = 14;
	override description = 'HTTP method not allowed';
	override httpStatus = 405; // Method Not Allowed

	constructor(allowed_methods: HyperAPIMethod[]) {
		const filtered_methods = allowed_methods.filter(
			(method) => method !== 'UNDEF',
		);
		super(
			undefined,
			filtered_methods.length > 0
				? {
						Allow: filtered_methods.join(', '),
					}
				: undefined,
		);
	}
}
