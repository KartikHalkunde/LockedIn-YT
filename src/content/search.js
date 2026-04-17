// ===== SEARCH MODULE =====

function hideSearchRecommended(shouldHide) {
	if (!shouldHide) {
		const existingStyle = document.getElementById('lockedin-hide-search-recommended-style');
		if (existingStyle) existingStyle.remove();

		document.querySelectorAll('[data-lockedin-hidden="search-recommended"]').forEach((el) => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	let style = document.getElementById('lockedin-hide-search-recommended-style');
	if (!style) {
		style = document.createElement('style');
		style.id = 'lockedin-hide-search-recommended-style';
		style.textContent = `
			#primary > .ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer,
			#primary > .ytd-two-column-search-results-renderer ytd-shelf-renderer,
			ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer,
			ytd-two-column-search-results-renderer ytd-shelf-renderer,
			ytd-search ytd-horizontal-card-list-renderer,
			ytd-search ytd-shelf-renderer,
			ytd-search grid-shelf-view-model,
			[page-subtype="search"] ytd-horizontal-card-list-renderer,
			[page-subtype="search"] ytd-shelf-renderer,
			[page-subtype="search"] grid-shelf-view-model,
			ytm-search ytm-horizontal-card-list-renderer,
			ytm-search ytm-shelf-renderer {
				display: none !important;
			}
		`;

		(document.head || document.documentElement).appendChild(style);
	}

	if (!window.location.pathname.includes('/results')) return;

	const markHidden = (node) => {
		if (!node || node.hasAttribute('data-lockedin-hidden')) return;
		node.setAttribute('hidden', '');
		node.style.display = 'none';
		node.setAttribute('data-lockedin-hidden', 'search-recommended');
	};

	document.querySelectorAll('ytd-horizontal-card-list-renderer, ytd-shelf-renderer, ytm-horizontal-card-list-renderer, ytm-shelf-renderer').forEach((node) => {
		markHidden(node);

		const section = node.closest('ytd-item-section-renderer, ytm-item-section-renderer');
		if (!section) return;

		const hasRegularResults = section.querySelector('ytd-video-renderer, ytd-channel-renderer, ytd-playlist-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer');
		if (!hasRegularResults) {
			markHidden(section);
		}
	});
}

function ensureEssentialElementsVisible() {
	const player = document.querySelector('#movie_player, .html5-video-player');
	if (player) {
		player.style.display = '';
	}

	const primaryContainer = document.querySelector('#primary, #primary-inner');
	if (primaryContainer) {
		primaryContainer.style.display = '';
	}

	const searchResults = document.querySelector('#contents');
	if (searchResults) {
		searchResults.style.display = '';
	}

	document.querySelectorAll('ytd-video-renderer, ytd-channel-renderer, ytd-playlist-renderer').forEach(result => {
		if (window.location.href.includes('/results?search_query=')) {
			result.style.display = '';
		}
	});

	if (window.location.href.includes('/results?search_query=')) {
		const gridRenderer = document.querySelector('ytd-rich-grid-renderer');
		if (gridRenderer) {
			gridRenderer.style.display = '';
		}
	}

	const videoInfo = document.querySelector('#above-the-fold, #info, #meta');
	if (videoInfo) {
		videoInfo.style.display = '';
	}
}
