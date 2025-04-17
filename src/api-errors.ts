import {
	type HyperAPIErrorData,
	HyperAPIError,
} from './error.js';

export class HyperAPIAuthorizationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 1;
	description = 'Authorization error';
	httpStatus = 401; // Unauthorized
}

export class HyperAPIInvalidParametersError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 2;
	description = 'One of the parameters specified was missing or invalid';
	httpStatus = 400; // Bad Request
}

export class HyperAPIInternalError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 3;
	description = 'Internal error';
	httpStatus = 500; // Internal Server Error
}

export class HyperAPIForbiddenError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 4;
	description = 'You do not have permission to perform this action';
	httpStatus = 403; // Forbidden
}

export class HyperAPIUnknownMethodError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 5;
	description = 'Unknown method called';
	httpStatus = 404; // Not Found
}

export class HyperAPIObjectsLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 6;
	description = 'Too many objects requested';
	httpStatus = 400; // Bad Request
}

export class HyperAPIRateLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 7;
	description = 'Rate limit exceeded';
	httpStatus = 429; // Too Many Requests
}

export class HyperAPICaptchaError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 8;
	description = 'Captcha required';
	httpStatus = 428; // Precondition Required
}

export class HyperAPIBusyError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 10;
	description = 'Endpoint is busy';
	httpStatus = 503; // Service Unavailable
}

export class HyperAPIConfirmationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 11;
	description = 'Confirmation required';
	httpStatus = 409; // Conflict
}

export class HyperAPIOTPError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 12;
	description = 'One-time password required';
	httpStatus = 401; // Unauthorized
}

export class HyperAPIMaintenanceError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 13;
	description = 'Endpoint is in maintenance mode';
	httpStatus = 503; // Service Unavailable
}

export class HyperAPIMethodNotAllowedError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
	code = 14;
	description = 'HTTP method not allowed';
	httpStatus = 405; // Method Not Allowed
}
