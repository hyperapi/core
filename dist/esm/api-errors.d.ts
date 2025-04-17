import { type HyperAPIErrorData, HyperAPIError } from './error.js';
export declare class HyperAPIAuthorizationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIInvalidParametersError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIInternalError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIForbiddenError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIUnknownMethodError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIObjectsLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIRateLimitError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPICaptchaError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIBusyError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIConfirmationError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIOTPError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIMaintenanceError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIMethodNotAllowedError<D extends HyperAPIErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
