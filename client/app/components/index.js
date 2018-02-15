// Include all modules to be picked up by webpack
// after being retrieved through data-component

export function resolveComponent(path) {
	let module = require('./' + path);
	const Component = module.default;
	return Component;
}
