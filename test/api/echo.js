
export default function (request) {
	console.log(request);

	return `Hello, ${request.args.name}!`;
}
