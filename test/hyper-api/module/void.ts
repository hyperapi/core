import { hyperApi } from '../../server.js';

export default hyperApi.module().action(() => {
	process.hrtime();
});
