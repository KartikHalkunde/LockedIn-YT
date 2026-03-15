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

	const recommendedKeywords = [
		'explore more',
		'channels new to you',
		'people also watched',
		'people also search for',
		'searches related to',
		'previously watched',
		'related to your search',
		'from related searches',
		'for you',
		'related searches'
	];

	document.querySelectorAll('ytd-shelf-renderer').forEach(shelf => {
		const title = shelf.querySelector('#title');
		if (title) {
			const titleText = title.textContent.toLowerCase().trim();
			if (recommendedKeywords.some(keyword => titleText.includes(keyword))) {
				if (!shelf.hasAttribute('data-lockedin-hidden')) {
					shelf.setAttribute('hidden', '');
					shelf.setAttribute('data-lockedin-hidden', 'search-recommended');
				}
			}
		}
	});

	document.querySelectorAll('ytd-horizontal-card-list-renderer, ytd-item-section-renderer').forEach(section => {
		const sectionText = (section.textContent || '').toLowerCase().trim();
		const heading = section.querySelector('yt-formatted-string, #title, #header, #title-text');
		const headingText = (heading?.textContent || '').toLowerCase().trim();

		const hasRefinementCards = section.querySelector('ytd-search-refinement-card-renderer, ytm-search-refinement-card-renderer');
		const matchesKeyword = recommendedKeywords.some(keyword =>
			headingText.includes(keyword) || sectionText.includes(keyword)
		);

		if (hasRefinementCards || matchesKeyword) {
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
