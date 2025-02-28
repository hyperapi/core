export type EmptyObject = Omit<{
    p: never;
}, 'p'>;
export type MaybePromise<T> = T | Promise<T>;
