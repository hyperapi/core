
import HyperAPIError from './error.js';

export class HyperAPIAuthorizationError extends HyperAPIError {
	code = 1;
	description = 'Authorization error';
	httpStatus = 401;
}

export class HyperAPIInvalidParametersError extends HyperAPIError {
	code = 2;
	description = 'One of the parameters specified was missing or invalid';
	httpStatus = 400;
}

export class HyperAPIInternalError extends HyperAPIError {
	code = 3;
	description = 'Internal error';
	httpStatus = 500;
}

export class HyperAPIForbiddenError extends HyperAPIError {
	code = 4;
	description = 'You do not have permission to perform this action';
	httpStatus = 403;
}

export class HyperAPIUnknownMethodError extends HyperAPIError {
	code = 5;
	description = 'Unknown method called';
	httpStatus = 404;
}

export class HyperAPIObjectsLimitError extends HyperAPIError {
	code = 6;
	description = 'Too many objects requested';
	httpStatus = 400;
}

export class HyperAPIRateLimitError extends HyperAPIError {
	code = 7;
	description = 'Rate limit exceeded';
	httpStatus = 429;
}

export class HyperAPICaptchaError extends HyperAPIError {
	code = 8;
	description = 'Captcha required';
	httpStatus = 400;
}

export class HyperAPIBusyError extends HyperAPIError {
	code = 10;
	description = 'Endpoint is busy';
	httpStatus = 503;
}

export class HyperAPIConfirmationError extends HyperAPIError {
	code = 11;
	description = 'Confirmation required';
	httpStatus = 400;
}

export class HyperAPIOTPError extends HyperAPIError {
	code = 12;
	description = 'One-time password required';
	httpStatus = 400;
}

export class HyperAPIMaintenanceError extends HyperAPIError {
	code = 98;
	description = 'Endpoint is in maintenance mode';
	httpStatus = 503;
}

export class HyperAPIUnknownError extends HyperAPIError {
	code = 99;
	description = 'Unknown error';
	httpStatus = 500;
}
