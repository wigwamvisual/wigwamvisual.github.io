import { resolveComponent } from './components';
import { watchVisible } from './utils/visible';

// let components = $('*[data-component]');
let components = document.querySelectorAll('*[data-component]');

// Load each component
[].forEach.call(components, element => {

	let componentPath = element.getAttribute('data-component');
	let Component = resolveComponent(componentPath);
	
	if (!Component) {
		console.warn(`Unable to instance component '${componentPath}'`);
	}
	else {
		element.component = new Component(element);
	}
});


// watchVisible();
