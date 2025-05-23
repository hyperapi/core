import type { EmptyObject } from 'type-fest';
import {
	type HyperAPIDriver,
	type HyperAPIDriverHandler,
	type HyperAPIModule,
	type HyperAPIRequest,
	type HyperAPIRequestArgs,
	HyperAPI,
	HyperAPIError,
} from '../src/main.js';
import type { HyperAPIMethod } from '../src/utils/methods.js';

interface DriverRequest<A extends HyperAPIRequestArgs = EmptyObject> extends HyperAPIRequest<A> {
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
	): Promise<[ boolean, unknown ]>;
	async trigger(
		method: HyperAPIMethod,
		path: string,
		args: Record<string, unknown>,
		use_http: true,
	): Promise<[ boolean, unknown, { status: number | undefined } ]>;
	async trigger(
		method: HyperAPIMethod,
		path: string,
		args: Record<string, unknown> = {},
		use_http: boolean = false,
	): Promise<[ boolean, unknown ] | [ boolean, unknown, { status: number | undefined }]> {
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
				: [
					false,
					response.getResponse(),
				];
		}

		return [
			true,
			response,
		];
	}
}

export const driver = new HyperAPITestDriver();

export interface LocalRequest<A extends HyperAPIRequestArgs = EmptyObject> extends DriverRequest<A> {
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

/* eslint-disable @typescript-eslint/no-unused-vars */

hyperApi.setTransformer((request) => {
	const {
		foo,
		// @ts-expect-error Accessing property that does not exist on DriverRequest
		bar,
	} = request;

	return {
		...request,
		bar: 10,
	};
});

hyperApi.onModule((request, module) => {
	const {
		foo,
		bar,
	} = request;

	const {
		default: default_,
		argsValidator,
		auth,
	} = module;
});

hyperApi.onResponse((request, module, response) => {
	const {
		foo,
		bar,
	} = request;

	const {
		default: default_,
		argsValidator,
		auth,
	} = module;

	// response;
});

/* eslint-enable @typescript-eslint/no-unused-vars */
