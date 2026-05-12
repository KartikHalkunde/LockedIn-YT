// ===== SHORTS MODULE =====

function allChildrenHidden(element) {
	for (let i = 0; i < element.childElementCount; i++) {
		if (!element.children[i].hasAttribute('hidden')) {
			return false;
		}
	}
	return true;
}

function findParentWithElementTag(element, container) {
	while (element.tagName.toLowerCase() !== container && element.parentElement !== null) {
		element = element.parentElement;
	}
	return element.tagName.toLowerCase() === container ? element : null;
}

function hideContainerOfElement(container, element) {
	if (allChildrenHidden(element.parentElement)) {
		const parent = findParentWithElementTag(element.parentElement, container);
		if (parent === null) return;
		if (!parent.hasAttribute('data-lockedin-hidden')) {
			parent.setAttribute('hidden', '');
			parent.setAttribute('data-lockedin-hidden', 'shorts');
		}
	}
}

class RearrangeVideosInGrid {
	constructor() {
		this.RICH_GRID_ROW = 'ytd-rich-grid-row';
	}

	countVisibleElementsInRow(row) {
		let visibleCount = 0;
		for (const child of row.children) {
			if (!child.hasAttribute('hidden')) {
				visibleCount++;
			}
		}
		return visibleCount;
	}

	rearrangeVideosInRichGridRows(startFromRowElement, elementsPerRow) {
		const richGridRows = startFromRowElement.parentElement.parentElement.querySelectorAll(this.RICH_GRID_ROW);
		const startIndex = Array.from(richGridRows).indexOf(startFromRowElement.parentElement);

		const amountOfVisibleElements = this.countVisibleElementsInRow(startFromRowElement);
		const elementsToMove = elementsPerRow - amountOfVisibleElements;

		for (let j = 0; j < elementsToMove; j++) {
			for (let i = startIndex; i < richGridRows.length - 1; i++) {
				const nextRichRowDiv = richGridRows[i + 1].querySelector('div');
				if (nextRichRowDiv.childElementCount <= 0) break;
				richGridRows[i].querySelector('div').appendChild(nextRichRowDiv.childNodes[0]);
			}
		}
	}

	execute(element) {
		if (element.parentElement && element.parentElement.parentElement &&
				element.parentElement.parentElement.tagName.toLowerCase().match(this.RICH_GRID_ROW) &&
				element.hasAttribute('items-per-row')) {
			const pElement = element.parentElement;
			const itemsPerRow = element.getAttribute('items-per-row');
			element.remove();
			this.rearrangeVideosInRichGridRows(pElement, itemsPerRow);
		}
	}
}

const gridRearranger = new RearrangeVideosInGrid();

function hideShortsHomepage(shouldHide) {
	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="shorts-homepage"]').forEach(el => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	const guideShortsSelectors = [
		'ytd-guide-entry-renderer a[href="/shorts"]',
		'ytd-guide-entry-renderer a[title="Shorts"]',
		'ytd-mini-guide-entry-renderer a[href="/shorts"]',
		'ytd-mini-guide-entry-renderer a[title="Shorts"]',
		'ytm-pivot-bar-item-renderer a[href="/shorts"]',
		'ytm-pivot-bar-renderer a[title="Shorts"]'
	];

	guideShortsSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(link => {
			const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, ytm-pivot-bar-item-renderer');
			if (container && !container.hasAttribute('data-lockedin-hidden')) {
				container.setAttribute('hidden', '');
				container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
			}
		});
	});

	const shortsShelfSelector = getAllSelectors('shortsShelf');
	const shelfSelectors = [
		shortsShelfSelector,
		'ytd-rich-shelf-renderer',
		'ytd-rich-section-renderer',
		'ytm-rich-shelf-renderer',
		'ytm-item-section-renderer'
	];

	shelfSelectors.forEach(selector => {
		if (!selector) return;
		document.querySelectorAll(selector).forEach(shelf => {
			const hasReelItems = shelf.querySelector('ytd-reel-item-renderer, ytm-reel-item-renderer') !== null;
			const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;

			if (hasReelItems || hasShortsLinks) {
				if (!shelf.hasAttribute('data-lockedin-hidden')) {
					shelf.setAttribute('hidden', '');
					shelf.setAttribute('data-lockedin-hidden', 'shorts-homepage');
					gridRearranger.execute(shelf);
				}
			}
		});
	});

	const isHomepageSurface = isHomeLikeSurface();
	if (isHomepageSurface) {
		const videoRendererSelectors = [
			'ytd-rich-item-renderer',
			'ytd-reel-item-renderer',
			'ytm-video-with-context-renderer',
			'ytm-shorts-lockup-view-model',
			'ytm-reel-item-renderer'
		];

		videoRendererSelectors.forEach(selector => {
			document.querySelectorAll(selector).forEach(video => {
				const shortsLink = video.querySelector('[href^="/shorts/"]');

				if (shortsLink && !video.hasAttribute('data-lockedin-hidden')) {
					video.setAttribute('hidden', '');
					video.setAttribute('data-lockedin-hidden', 'shorts-homepage');
					gridRearranger.execute(video);
					hideContainerIfAllChildrenHiddenHomepage(video);
				}
			});
		});
	}

	if (isHomepageSurface) {
		document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
			const container = overlay.closest('ytd-rich-item-renderer');

			if (container && !container.hasAttribute('data-lockedin-hidden')) {
				container.setAttribute('hidden', '');
				container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
				hideContainerIfAllChildrenHiddenHomepage(container);
			}
		});
	}
}

function hideShortsSearch(shouldHide) {
	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="shorts-search"]').forEach(el => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	const isSearchPage = window.location.pathname.includes('/results');
	if (!isSearchPage) return;

	const shelfSelectors = [
		'ytd-reel-shelf-renderer',
		'ytd-rich-shelf-renderer',
		'ytd-rich-section-renderer',
		'grid-shelf-view-model'
	];

	shelfSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(shelf => {
			const hasReelItems = shelf.querySelector('ytd-reel-item-renderer') !== null;
			const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;

			if (hasReelItems || hasShortsLinks) {
				if (!shelf.hasAttribute('data-lockedin-hidden')) {
					shelf.setAttribute('hidden', '');
					shelf.setAttribute('data-lockedin-hidden', 'shorts-search');
				}
			}
		});
	});

	const videoRendererSelectors = [
		'ytd-video-renderer',
		'ytd-reel-item-renderer'
	];

	videoRendererSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(video => {
			const shortsLink = video.querySelector('[href^="/shorts/"]');

			if (shortsLink && !video.hasAttribute('data-lockedin-hidden')) {
				video.setAttribute('hidden', '');
				video.setAttribute('data-lockedin-hidden', 'shorts-search');
				hideContainerIfAllChildrenHiddenSearch(video);
			}
		});
	});

	document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(overlay => {
		const container = overlay.closest('ytd-video-renderer');

		if (container && !container.hasAttribute('data-lockedin-hidden')) {
			container.setAttribute('hidden', '');
			container.setAttribute('data-lockedin-hidden', 'shorts-search');
			hideContainerIfAllChildrenHiddenSearch(container);
		}
	});

	document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach(chip => {
		const shortsTarget = chip.querySelector('[href^="/shorts"], [data-pivot-id="shorts"]');
		if (shortsTarget && !chip.hasAttribute('data-lockedin-hidden')) {
			chip.setAttribute('hidden', '');
			chip.setAttribute('data-lockedin-hidden', 'shorts-search');
		}
	});
}

function hideContainerIfAllChildrenHiddenHomepage(element) {
	const parent = element.parentElement;
	if (!parent) return;

	let allHidden = true;
	for (let i = 0; i < parent.children.length; i++) {
		if (!parent.children[i].hasAttribute('hidden')) {
			allHidden = false;
			break;
		}
	}

	if (allHidden) {
		const containerSelectors = [
			'ytd-item-section-renderer',
			'ytd-shelf-renderer',
			'ytd-rich-grid-row'
		];

		for (const selector of containerSelectors) {
			const container = element.closest(selector);
			if (container && !container.hasAttribute('data-lockedin-hidden')) {
				container.setAttribute('hidden', '');
				container.setAttribute('data-lockedin-hidden', 'shorts-homepage');
				break;
			}
		}
	}
}

function hideContainerIfAllChildrenHiddenSearch(element) {
	const parent = element.parentElement;
	if (!parent) return;

	let allHidden = true;
	for (let i = 0; i < parent.children.length; i++) {
		if (!parent.children[i].hasAttribute('hidden')) {
			allHidden = false;
			break;
		}
	}

	if (allHidden) {
		const containerSelectors = [
			'ytd-item-section-renderer',
			'ytd-shelf-renderer'
		];

		for (const selector of containerSelectors) {
			const container = element.closest(selector);
			if (container && !container.hasAttribute('data-lockedin-hidden')) {
				container.setAttribute('hidden', '');
				container.setAttribute('data-lockedin-hidden', 'shorts-search');
				break;
			}
		}
	}
}

function hideShortsGlobally(shouldHide) {
	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="shorts-global"]').forEach(el => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	const guideShortsSelectors = [
		'ytd-guide-entry-renderer a[href="/shorts"]',
		'ytd-guide-entry-renderer a[title="Shorts"]',
		'ytd-mini-guide-entry-renderer a[href="/shorts"]',
		'ytd-mini-guide-entry-renderer a[title="Shorts"]',
		'ytm-pivot-bar-item-renderer a[href="/shorts"]'
	];

	guideShortsSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(link => {
			const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, ytm-pivot-bar-item-renderer');
			if (container && !container.hasAttribute('data-lockedin-hidden')) {
				container.setAttribute('hidden', '');
				container.setAttribute('data-lockedin-hidden', 'shorts-global');
			}
		});
	});

	const shelfSelectors = [
		'ytd-reel-shelf-renderer',
		'ytd-rich-shelf-renderer',
		'ytd-rich-section-renderer',
		'grid-shelf-view-model',
		'ytm-reel-shelf-renderer'
	];

	shelfSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(shelf => {
			const hasReelItems = shelf.querySelector('ytd-reel-item-renderer, ytm-shorts-lockup-view-model') !== null;
			const hasShortsLinks = shelf.querySelector('[href^="/shorts/"]') !== null;

			if (hasReelItems || hasShortsLinks) {
				if (!shelf.hasAttribute('data-lockedin-hidden')) {
					shelf.setAttribute('hidden', '');
					shelf.setAttribute('data-lockedin-hidden', 'shorts-global');
				}
			}
		});
	});

	const videoRendererSelectors = [
		'ytd-rich-item-renderer',
		'ytd-video-renderer',
		'ytd-grid-video-renderer',
		'ytd-compact-video-renderer',
		'ytd-reel-item-renderer',
		'ytm-shorts-lockup-view-model',
		'ytm-shorts-lockup-view-model-v2',
		'ytm-video-with-context-renderer'
	];

	videoRendererSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(video => {
			const shortsLink = video.querySelector('[href^="/shorts/"]');
			const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');

			if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
				video.setAttribute('hidden', '');
				video.setAttribute('data-lockedin-hidden', 'shorts-global');
			}
		});
	});

	document.querySelectorAll('#secondary ytd-compact-video-renderer, #related ytd-compact-video-renderer').forEach(video => {
		const shortsLink = video.querySelector('[href^="/shorts/"]');
		const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');

		if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
			video.setAttribute('hidden', '');
			video.setAttribute('data-lockedin-hidden', 'shorts-global');
		}
	});

	document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach(chip => {
		const shortsTarget = chip.querySelector('[href^="/shorts"], [data-pivot-id="shorts"]');
		if (shortsTarget && !chip.hasAttribute('data-lockedin-hidden')) {
			chip.setAttribute('hidden', '');
			chip.setAttribute('data-lockedin-hidden', 'shorts-global');
		}
	});

	document.querySelectorAll('ytd-grid-video-renderer, ytd-expanded-shelf-contents-renderer').forEach(video => {
		const shortsLink = video.querySelector('[href^="/shorts/"]');
		const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');

		if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
			video.setAttribute('hidden', '');
			video.setAttribute('data-lockedin-hidden', 'shorts-global');
		}
	});

	document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer').forEach(video => {
		const shortsLink = video.querySelector('[href^="/shorts/"]');
		const shortsOverlay = video.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');

		if ((shortsLink || shortsOverlay) && !video.hasAttribute('data-lockedin-hidden')) {
			video.setAttribute('hidden', '');
			video.setAttribute('data-lockedin-hidden', 'shorts-global');
		}
	});
}

async function redirectShorts(shouldRedirect) {
	if (!shouldRedirect) return;

	if (window.location.pathname.startsWith('/shorts/')) {
		const videoId = window.location.pathname.split('/shorts/')[1]?.split('?')[0]?.split('/')[0];
		if (videoId && videoId.length === 11) {
			if (window._lockedinShortsRedirected !== window.location.href) {
				window._lockedinShortsRedirected = window.location.href;
				if (typeof trackStat === 'function') {
					await trackStat('shortsAvoided', 1, { requireActive: false });
				}
			}
			const searchParams = new URLSearchParams(window.location.search);
			const newUrl = `https://www.youtube.com/watch?v=${videoId}${searchParams.toString() ? '&' + searchParams.toString() : ''}`;
			window.location.replace(newUrl);
		}
	}
}

function hideEndCardsForShortsInPlayer(shouldHide) {
	if (window._lockedinShortsEndCardObserver) {
		window._lockedinShortsEndCardObserver.disconnect();
		window._lockedinShortsEndCardObserver = null;
	}

	if (!shouldHide) return;
	if (!window.location.pathname.startsWith('/watch')) return;

	const isShortVideo = () => {
		const video = document.querySelector('video.html5-main-video, video');
		if (video && video.duration && !isNaN(video.duration)) {
			return video.duration <= 60;
		}

		const timeDisplay = document.querySelector('.ytp-time-duration');
		if (timeDisplay) {
			const timeText = timeDisplay.textContent;
			const parts = timeText.split(':');
			if (parts.length === 2) {
				const minutes = parseInt(parts[0], 10);
				const seconds = parseInt(parts[1], 10);
				const totalSeconds = minutes * 60 + seconds;
				return totalSeconds <= 60;
			}
		}

		return false;
	};

	const hideEndScreenElements = () => {
		if (!isShortVideo()) return;

		const player = document.querySelector('#movie_player');
		if (!player) return;

		player.querySelectorAll('.ytp-ce-element, .ytp-ce-video, .ytp-ce-playlist, .ytp-ce-channel, .ytp-ce-website').forEach(el => {
			el.style.display = 'none';
		});

		player.querySelectorAll('.ytp-ce-covering-overlay, .ytp-ce-shadow').forEach(el => {
			el.style.display = 'none';
		});

		player.querySelectorAll('.ytp-endscreen-content, .html5-endscreen').forEach(el => {
			el.style.display = 'none';
			el.style.visibility = 'hidden';
			el.style.opacity = '0';
		});

		player.querySelectorAll('.ytp-videowall-still, .ytp-videowall-still-image, .videowall-endscreen').forEach(el => {
			el.style.display = 'none';
		});

		player.querySelectorAll('.ytp-autonav-endscreen, .ytp-autonav-endscreen-upnext-container, .ytp-suggestion-set').forEach(el => {
			el.style.display = 'none';
		});
	};

	const video = document.querySelector('video.html5-main-video, video');
	if (video) {
		video.addEventListener('loadedmetadata', hideEndScreenElements);
		video.addEventListener('durationchange', hideEndScreenElements);
	}

	setTimeout(hideEndScreenElements, 1000);
	setTimeout(hideEndScreenElements, 2000);

	const player = document.querySelector('#movie_player, .html5-video-player');
	if (player) {
		const observer = new MutationObserver(() => {
			hideEndScreenElements();
		});

		observer.observe(player, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		});

		window._lockedinShortsEndCardObserver = observer;
	}
}

function setupShortsLinkInterception(shouldIntercept) {
	const interceptHandler = async (event) => {
		const link = event.target.closest('a[href^="/shorts/"]');
		if (!link) return;

		const href = link.getAttribute('href');
		if (href && href.startsWith('/shorts/')) {
			event.preventDefault();
			event.stopPropagation();

			const videoId = href.split('/shorts/')[1]?.split('?')[0]?.split('/')[0];
			if (videoId && videoId.length === 11) {
				if (typeof trackStat === 'function') {
					await trackStat('shortsAvoided', 1, { requireActive: false });
				}
				window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
			}
		}
	};

	document.removeEventListener('click', window._lockedinShortsInterceptHandler, true);

	if (shouldIntercept) {
		window._lockedinShortsInterceptHandler = interceptHandler;
		document.addEventListener('click', interceptHandler, true);
	}
}
