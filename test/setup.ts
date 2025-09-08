import type { EmptyObject } from 'type-fest';
import {
	HyperAPI,
	type HyperAPIDriver,
	type HyperAPIDriverHandler,
	HyperAPIError,
	type HyperAPIModule,
	type HyperAPIRequest,
	type HyperAPIRequestArgs,
} from '../src/main.js';
import type { HyperAPIMethod } from '../src/utils/methods.js';

interface DriverRequest<A extends HyperAPIRequestArgs = EmptyObject>
	extends HyperAPIRequest<A> {
	foo: string;
}

class HyperAPITestDriver implements HyperAPIDriver<DriverRequest> {
	private handler: HyperAPIDriverHandler<DriverRequest> | null = null;

	start(handler: HyperAPIDriverHandler<DriverRequest>): void {
		this.handler = handler;
	}

	stop(): void {
		this.handler = null;
	}

	async trigger(
		method: HyperAPIMethod,
		path: string,
		args?: Record<string, unknown>,
	): Promise<[boolean, unknown]>;
	async trigger(
		method: HyperAPIMethod,
		path: string,
		args: Record<string, unknown>,
		use_http: true,
	): Promise<[boolean, unknown, { status: number | undefined }]>;
	async trigger(
		method: HyperAPIMethod,
		path: string,
		args: Record<string, unknown> = {},
		use_http = false,
	): Promise<
		[boolean, unknown] | [boolean, unknown, { status: number | undefined }]
	> {
		if (!this.handler) {
			throw new Error('No handler available.');
		}

		const response = await this.handler({
			method,
			path,
			args,
			foo: 'bar',
		});

		if (response instanceof HyperAPIError) {
			return use_http === true
				? [
						false,
						response.getResponse(),
						{
							status: response.httpStatus,
						},
					]
				: [false, response.getResponse()];
		}

		return [true, response];
	}
}

export const driver = new HyperAPITestDriver();

export interface LocalRequest<A extends HyperAPIRequestArgs = EmptyObject>
	extends DriverRequest<A> {
	bar: number;
}

export interface LocalModule<R extends LocalRequest> extends HyperAPIModule<R> {
	auth: boolean;
}

export const hyperApi_simple = new HyperAPI({
	driver,
	root: new URL('../test/hyper-api', import.meta.url).pathname,
});

export const hyperApi = new HyperAPI<
	typeof driver,
	LocalRequest,
	LocalModule<LocalRequest>
>({
	driver,
	root: new URL('../test/hyper-api', import.meta.url).pathname,
});

/* oxlint-disable no-unused-vars */

hyperApi.onBeforeRouter((ctx) => {
	const {
		foo,
		// @ts-expect-error Accessing property that does not exist on DriverRequest
		bar,
	} = ctx.driver_request;
});

hyperApi.setRequestTransformer((ctx) => {
	const {
		foo,
		// @ts-expect-error Accessing property that does not exist on DriverRequest
		bar,
	} = ctx.driver_request;

	return {
		...ctx.driver_request,
		bar: 10,
	};
});

hyperApi.onBeforeExecute((ctx) => {
	const { foo, bar } = ctx.request;

	const { default: default_, argsValidator, auth } = ctx.module;
});

hyperApi.onResponse((ctx) => {
	const {
		foo,
		// @ts-expect-error Accessing property that does not exist on DriverRequest
		bar,
	} = ctx.driver_request;

	if (ctx.request) {
		// eslint-disable-next-line no-shadow
		const { foo, bar } = ctx.request;
	}

	if (ctx.module) {
		const { default: default_, argsValidator, auth } = ctx.module;
	}

	// oxlint-disable-next-line no-console
	console.log(ctx.response);
});

/* oxlint-enable no-unused-vars */
