import { NeoEvent, NeoEventTarget } from 'neoevents';
import type { HyperAPIRequest } from './request.js';
import type { HyperAPIResponse } from './response.js';

export class HyperAPIDriver<
	R extends HyperAPIRequest = HyperAPIRequest,
> extends NeoEventTarget<{
	request: NeoEvent<{
		request: R;
		callback: (response: HyperAPIResponse) => void;
	}>;
}> {
	// declare R: R;

	fetch(request: R): Promise<HyperAPIResponse> {
		return new Promise<HyperAPIResponse>((resolve) => {
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
