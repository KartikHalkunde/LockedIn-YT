// ===== SEARCH MODULE =====

function hideSearchRecommended(shouldHide) {
	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="search-recommended"]').forEach(el => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	if (!window.location.pathname.includes('/results')) return;

	document.querySelectorAll('ytd-shelf-renderer').forEach(shelf => {
		const hasRefinementCards = shelf.querySelector('ytd-search-refinement-card-renderer, ytm-search-refinement-card-renderer');
		const hasHorizontalCards = shelf.querySelector('ytd-horizontal-card-list-renderer, ytm-horizontal-card-list-renderer');
		if (hasRefinementCards || hasHorizontalCards) {
			if (!shelf.hasAttribute('data-lockedin-hidden')) {
				shelf.setAttribute('hidden', '');
				shelf.setAttribute('data-lockedin-hidden', 'search-recommended');
			}
		}
	});

	document.querySelectorAll('ytd-horizontal-card-list-renderer, ytd-item-section-renderer').forEach(section => {
		const hasRefinementCards = section.querySelector('ytd-search-refinement-card-renderer, ytm-search-refinement-card-renderer');
		const hasHorizontalCards = section.querySelector('ytd-horizontal-card-list-renderer, ytm-horizontal-card-list-renderer');

		if (hasRefinementCards || hasHorizontalCards) {
			if (!section.hasAttribute('data-lockedin-hidden')) {
				section.setAttribute('hidden', '');
				section.setAttribute('data-lockedin-hidden', 'search-recommended');
			}
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
