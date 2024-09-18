import {
	HyperAPI,
	HyperAPIDriver,
	HyperAPIDriverHandler,
	HyperAPIError,
	HyperAPIModule,
	HyperAPIRequest,
	HyperAPIRequestArgs,
} from '../src/main.js';
import type {
	EmptyObject,
	HTTPMethod,
} from '../src/utils/types.js';

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
		method: HTTPMethod,
		path: string,
		args: Record<string, unknown> = {},
	): Promise<[ boolean, unknown ]> {
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
			return [
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

hyperApi.onResponse((request, module) => {
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

/* eslint-enable @typescript-eslint/no-unused-vars */
