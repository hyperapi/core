export type EmptyObject = Omit<{
    p: never;
}, 'p'>;
export type MaybePromise<T> = T | Promise<T>;
export type HTTPMethod = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'UNKNOWN';
