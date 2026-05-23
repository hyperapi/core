import { HyperAPIDriver } from '../src/driver.js';
import { HyperAPIError } from '../src/error.js';
import type { HyperAPIRequest, HyperAPIRequestArgs } from '../src/request.js';
import type { HyperAPIMethod } from '../src/utils/methods.js';
import type { EmptyObject } from '../src/utils/record.js';

export interface TestRequest<A extends HyperAPIRequestArgs = EmptyObject>
	extends HyperAPIRequest<A> {
	foo: string;
}

export class HyperAPITestDriver extends HyperAPIDriver<TestRequest> {
	async trigger(
		method: HyperAPIMethod,
		path: string,
		args: Record<string, unknown> = {},
	): Promise<
		[
			boolean,
			unknown,
			{
				status: number | undefined;
				headers: Record<string, string> | undefined;
			},
		]
	> {
		const response = await this.emitRequest({
			method,
			path,
			args,
			foo: 'bar',
		});

		if (response instanceof HyperAPIError) {
			return [
				false,
				response.getResponse(),
				{
					status: response.httpStatus,
					headers: response.httpHeaders,
				},
			];
		}

		return [true, response, { status: 200, headers: {} }];
	}
}
