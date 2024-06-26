export class HyperAPIAuthorizationError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIInvalidParametersError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIInternalError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIForbiddenError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIUnknownMethodError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIObjectsLimitError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIRateLimitError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPICaptchaError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIBusyError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIConfirmationError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIOTPError extends HyperAPIError {
    code: number;
    description: string;
}
export class HyperAPIMaintenanceError extends HyperAPIError {
    code: number;
    description: string;
}
import { HyperAPIError } from './error.js';
