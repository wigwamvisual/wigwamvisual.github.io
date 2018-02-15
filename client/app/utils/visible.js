let listeners = [];

export default function visible(element, callback, threshold = 0.5) {
	// Add an entry for it
	const listener = calculateListener({
		element,
		callback,
		threshold
	});

	listeners.push(listener);
}


function calculateListener(listener) {
	// Keep it's current dimensions updated
	return {
		...listener,
		top: listener.element.offsetTop,
		height: listener.element.offsetHeight
	};
}


function checkListener(listener, scrollTop, windowHeight) {
	// Is the element in view?
	if (listener.threshold > 1) {
		return scrollTop + windowHeight > listener.top + listener.threshold;
	}
	else {
		return scrollTop + windowHeight > listener.top + listener.height * listener.threshold;
	}
}


function activateListener(listener) {
	// Activate the callback!
	listener.callback();
}


function checkVisible() {

	const scrollTop = window.pageYOffset;
	const windowHeight = window.innerHeight;

	// Attempt to remove any visible elements
	listeners = listeners.filter(listener => {

		const active = checkListener(listener, scrollTop, windowHeight);

		if (active) {
			activateListener(listener);
		}

		return !active;
	});
}


export function watchVisible() {
	// Watch for resizes to recalculate element dimensions
	window.onresize = (e) => {
		listeners = listeners.map(listener => calculateListener(listener));
	}

	// Start watching for visible elements
	window.addEventListener("scroll", checkVisible);

	checkVisible();
}
