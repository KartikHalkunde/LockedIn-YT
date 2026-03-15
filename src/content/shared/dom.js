// ===== SHARED DOM HELPERS =====

function setRootFlag(flag, enabled) {
	const root = document.documentElement;
	if (!root) return;
	if (enabled) {
		root.setAttribute(flag, 'true');
	} else {
		root.removeAttribute(flag);
	}
}

function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

function toggleElement(selector, shouldHide) {
	const element = document.querySelector(selector);
	if (element) {
		element.style.display = shouldHide ? 'none' : '';
	}
}

function toggleAllElements(selector, shouldHide) {
	document.querySelectorAll(selector).forEach(el => {
		el.style.display = shouldHide ? 'none' : '';
	});
}

function togglePlayerElements(selector, shouldHide) {
	const player = document.querySelector('#movie_player');
	if (!player) return;
	player.querySelectorAll(selector).forEach(el => {
		el.style.display = shouldHide ? 'none' : '';
	});
}
