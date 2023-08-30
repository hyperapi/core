
import HyperAPIError from './error.js';

export class HyperAPIAuthorizationError extends HyperAPIError {
	code = 1;
	description = 'Authorization error';
	httpStatus = 401; // Unauthorized
}

export class HyperAPIInvalidParametersError extends HyperAPIError {
	code = 2;
	description = 'One of the parameters specified was missing or invalid';
	httpStatus = 400; // Bad Request
}

export class HyperAPIInternalError extends HyperAPIError {
	code = 3;
	description = 'Internal error';
	httpStatus = 500; // Internal Server Error
}

export class HyperAPIForbiddenError extends HyperAPIError {
	code = 4;
	description = 'You do not have permission to perform this action';
	httpStatus = 403; // Forbidden
}

export class HyperAPIUnknownMethodError extends HyperAPIError {
	code = 5;
	description = 'Unknown method called';
	httpStatus = 404; // Not Found
}

export class HyperAPIObjectsLimitError extends HyperAPIError {
	code = 6;
	description = 'Too many objects requested';
	httpStatus = 400; // Bad Request
}

export class HyperAPIRateLimitError extends HyperAPIError {
	code = 7;
	description = 'Rate limit exceeded';
	httpStatus = 429; // Too Many Requests
}

export class HyperAPICaptchaError extends HyperAPIError {
	code = 8;
	description = 'Captcha required';
	httpStatus = 428; // Precondition Required
}

export class HyperAPIBusyError extends HyperAPIError {
	code = 10;
	description = 'Endpoint is busy';
	httpStatus = 503; // Service Unavailable
}

export class HyperAPIConfirmationError extends HyperAPIError {
	code = 11;
	description = 'Confirmation required';
	httpStatus = 409; // Conflict
}

export class HyperAPIOTPError extends HyperAPIError {
	code = 12;
	description = 'One-time password required';
	httpStatus = 401; // Unauthorized
}

export class HyperAPIMaintenanceError extends HyperAPIError {
	code = 13;
	description = 'Endpoint is in maintenance mode';
	httpStatus = 503; // Service Unavailable
}
