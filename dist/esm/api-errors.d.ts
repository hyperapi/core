import { type ErrorData, HyperAPIError } from './error';
export declare class HyperAPIAuthorizationError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIInvalidParametersError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIInternalError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIForbiddenError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIUnknownMethodError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIObjectsLimitError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIRateLimitError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPICaptchaError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIBusyError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIConfirmationError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIOTPError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
export declare class HyperAPIMaintenanceError<D extends ErrorData> extends HyperAPIError<D> {
    code: number;
    description: string;
    httpStatus: number;
}
