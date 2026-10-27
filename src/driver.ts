import { NeoEvent, NeoEventTarget } from 'neoevents';
import { isRecord } from './dev.js';
import type { HyperAPIModuleResponse } from './module.js';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';

export class HyperAPIDriver<
	R extends HyperAPIRequest = HyperAPIRequest,
	Resp = HyperAPIModuleResponse,
> extends NeoEventTarget<{
	request: NeoEvent<{
		request: R;
		callback: (response: HyperAPIResponse<Resp>) => void;
	}>;
}> {
	/**
	 * Runtime counterpart of the `Resp` type argument. Drivers whose transport
	 * carries more than plain JSON override this to accept it:
	 *
	 * ```ts
	 * override isValidResponse(response: unknown): response is MyResponse {
	 * 	return response instanceof Response || super.isValidResponse(response);
	 * }
	 * ```
	 *
	 * Keep the override and `Resp` in sync: TypeScript cannot check that the
	 * predicate matches the type it claims to narrow to.
	 * @param response - The value a module returned.
	 * @returns -
	 */
	// oxlint-disable-next-line class-methods-use-this
	isValidResponse(response: unknown): response is Resp {
		return (
			response === undefined || isRecord(response) || Array.isArray(response)
		);
	}

	fetch(request: R): Promise<HyperAPIResponse<Resp>> {
		return new Promise<HyperAPIResponse<Resp>>((resolve) => {
			this.emit('request', {
				request,
				callback: resolve,
			});
		});
	}

	// override destroy(): void {
	// 	super.destroy();
	// }
}
