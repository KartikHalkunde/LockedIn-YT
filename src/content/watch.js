// ===== WATCH MODULE =====

function setCenteredWatchLayout(enabled) {
	const styleId = 'lockedin-center-watch-layout';
	let style = document.getElementById(styleId);

	if (!enabled) {
		document.documentElement.removeAttribute('data-lockedin-center-watch');
		if (style) style.remove();
		return;
	}

	document.documentElement.setAttribute('data-lockedin-center-watch', 'true');
	if (!style) {
		style = document.createElement('style');
		style.id = styleId;
		style.textContent = `
			html[data-lockedin-center-watch="true"],
			html[data-lockedin-center-watch="true"] body {
				overflow-x: hidden !important;
			}

			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #secondary {
				display: none !important;
			}

			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #columns {
				justify-content: center !important;
				max-width: 100% !important;
				overflow-x: clip !important;
				padding-right: 0 !important;
			}

			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #primary {
				margin-left: auto !important;
				margin-right: auto !important;
				width: min(calc(100% - 32px), var(--ytd-watch-flexy-max-player-width, 1280px)) !important;
				max-width: var(--ytd-watch-flexy-max-player-width, 1280px) !important;
				min-width: 0 !important;
			}

			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #primary-inner,
			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #below,
			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #meta,
			html[data-lockedin-center-watch="true"] ytd-watch-flexy[is-two-columns_] #comments {
				margin-left: auto !important;
				margin-right: auto !important;
				max-width: 100% !important;
				width: 100% !important;
				min-width: 0 !important;
			}
		`;
		(document.head || document.documentElement).appendChild(style);
	}
}

const TIME_SAVED_COMPLETION_THRESHOLD = 0.85;

function getCurrentVideoId() {
	try {
		const params = new URLSearchParams(window.location.search);
		return params.get('v');
	} catch (error) {
		return null;
	}
}

function initWatchTimeSavedTracking() {
	if (!window._lockedinTimeSavedTracker) {
		window._lockedinTimeSavedTracker = {
			video: null,
			videoId: null,
			watchedSeconds: 0,
			lastTime: null,
			creditedVideos: new Set()
		};
	}

	const tracker = window._lockedinTimeSavedTracker;
	const video = document.querySelector('video.html5-main-video, video');
	const videoId = getCurrentVideoId();

	if (!video) {
		return;
	}

	if (tracker.video !== video) {
		if (tracker.video) {
			tracker.video.removeEventListener('timeupdate', tracker.onTimeUpdate);
		}

		tracker.video = video;
		tracker.videoId = videoId;
		tracker.watchedSeconds = 0;
		tracker.lastTime = null;

		tracker.onTimeUpdate = () => {
			if (!tracker.video) return;
			const duration = tracker.video.duration;
			if (!Number.isFinite(duration) || duration <= 0) return;

			const currentId = getCurrentVideoId();
			if (currentId && currentId !== tracker.videoId) {
				tracker.videoId = currentId;
				tracker.watchedSeconds = 0;
				tracker.lastTime = null;
			}

			if (tracker.video.paused || tracker.video.seeking) {
				tracker.lastTime = tracker.video.currentTime;
				return;
			}

			if (tracker.lastTime !== null) {
				const delta = tracker.video.currentTime - tracker.lastTime;
				if (delta > 0 && delta < 5) {
					tracker.watchedSeconds += delta;
				}
			}

			tracker.lastTime = tracker.video.currentTime;

			const thresholdSeconds = duration * TIME_SAVED_COMPLETION_THRESHOLD;
			const hideSidebarOrRecs = !!(latestSyncedSettings && (latestSyncedSettings.hideSidebar || latestSyncedSettings.hideRecommended));
			if (!hideSidebarOrRecs) return;

			if (tracker.watchedSeconds >= thresholdSeconds && currentId && !tracker.creditedVideos.has(currentId)) {
				tracker.creditedVideos.add(currentId);
				const minutesSaved = duration / 2 / 60;
				trackStat('timeSavedMinutes', minutesSaved);
			}
		};

		tracker.video.addEventListener('timeupdate', tracker.onTimeUpdate);
	}
}

function hideSidebar(shouldHide) {
	if (!window.location.href.includes('/watch')) {
		return;
	}

	const playlistPanel = document.querySelector('#secondary ytd-playlist-panel-renderer, ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, #playlist');
	const hasPlaylistPanel = !!playlistPanel;

	const isEngagementPanel = (el) => {
		return el.tagName === 'YTD-ENGAGEMENT-PANEL-SECTION-LIST-RENDERER' ||
					 el.closest('ytd-engagement-panel-section-list-renderer') ||
					 el.querySelector('ytd-engagement-panel-section-list-renderer') ||
					 el.hasAttribute('target-id') ||
					 el.closest('[target-id]');
	};

	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="sidebar-recommendation"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		toggleElement('#secondary', false);
		toggleElement('#secondary-inner', false);
		toggleAllElements('.ytp-upnext, .ytp-upnext-container, .ytp-suggestion-set', false);
		setCenteredWatchLayout(false);
		ensureCommentsVisible();
		return;
	}

	if (hasPlaylistPanel) {
		const recommendationSelectors = [
			'#secondary ytd-compact-video-renderer',
			'#secondary ytd-compact-movie-renderer',
			'#secondary ytd-compact-radio-renderer',
			'#secondary ytd-compact-autoplay-renderer',
			'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer',
			'ytd-watch-next-secondary-results-renderer ytd-compact-movie-renderer',
			'ytd-watch-next-secondary-results-renderer ytd-compact-radio-renderer',
			'ytd-watch-next-secondary-results-renderer ytd-compact-autoplay-renderer'
		];
		recommendationSelectors.forEach(selector => {
			document.querySelectorAll(selector).forEach(el => {
				if (el.closest('ytd-playlist-panel-renderer')) return;
				if (isEngagementPanel(el)) return;
				if (!el.hasAttribute('data-lockedin-hidden')) {
					el.style.display = 'none';
					el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
				}
			});
		});
		const recommendationContainers = [
			'ytd-watch-next-secondary-results-renderer',
			'#related',
			'#secondary #items',
			'ytd-item-section-renderer',
			'ytd-continuation-item-renderer'
		];
		recommendationContainers.forEach(containerSel => {
			document.querySelectorAll(`#secondary ${containerSel}`).forEach(container => {
				if (playlistPanel && container.contains(playlistPanel)) return;
				if (isEngagementPanel(container)) return;
				const isLivestreamContainer = container.querySelector('ytd-compact-video-renderer, ytd-compact-autoplay-renderer');
				if (isLivestreamContainer || container.tagName.toLowerCase() === 'ytd-continuation-item-renderer') {
					if (!container.hasAttribute('data-lockedin-hidden')) {
						container.style.display = 'none';
						container.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
					}
				} else if (!container.hasAttribute('data-lockedin-hidden')) {
					container.style.display = 'none';
					container.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
				}
			});
		});
		toggleElement('#secondary', false);
		toggleElement('#secondary-inner', false);
	} else {
		const allVideoRenderers = [
			'ytd-compact-video-renderer',
			'ytd-compact-movie-renderer',
			'ytd-compact-radio-renderer',
			'ytd-compact-autoplay-renderer',
			'ytd-video-renderer',
			'ytm-compact-video-renderer',
			'ytm-video-with-context-renderer',
			'ytm-item-section-renderer',
			'ytm-compact-autoplay-renderer'
		];
		let recsCount = 0;
		allVideoRenderers.forEach(selector => {
			document.querySelectorAll(`#secondary ${selector}`).forEach(el => {
				if (isEngagementPanel(el)) return;
				if (!el.hasAttribute('data-lockedin-hidden')) {
					el.style.display = 'none';
					el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
					recsCount++;
				}
			});
		});
		if (recsCount > 0) {
			trackStat('recs', recsCount);
		}

		const allContainers = [
			'ytd-watch-next-secondary-results-renderer',
			'ytd-item-section-renderer',
			'ytd-continuation-item-renderer',
			'#related',
			'#items',
			'ytm-watch-next-secondary-results-renderer',
			'ytm-item-section-renderer'
		];
		allContainers.forEach(selector => {
			document.querySelectorAll(`#secondary ${selector}`).forEach(el => {
				if (isEngagementPanel(el)) return;
				if (!el.hasAttribute('data-lockedin-hidden')) {
					el.style.display = 'none';
					el.setAttribute('data-lockedin-hidden', 'sidebar-recommendation');
				}
			});
		});
	}

	toggleAllElements('.ytp-upnext, .ytp-upnext-container, .ytp-suggestion-set', true);
	setCenteredWatchLayout(true);
	ensureCommentsVisible();
	ensureTranscriptPanelVisible();
}

function hidePlaylists(shouldHide) {
	if (!window.location.href.includes('/watch')) {
		return;
	}

	const playlistPanel = document.querySelector('#secondary ytd-playlist-panel-renderer, ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, #playlist');

	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="current-playlist-panel"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		if (playlistPanel) {
			playlistPanel.style.display = '';
		}
		collapseSidebarIfEmpty();
		return;
	}

	if (playlistPanel && !playlistPanel.hasAttribute('data-lockedin-hidden')) {
		playlistPanel.style.display = 'none';
		playlistPanel.setAttribute('data-lockedin-hidden', 'current-playlist-panel');
	}
	collapseSidebarIfEmpty();
}

function hideRecommendedVideos(shouldHide) {
	if (!window.location.href.includes('/watch')) {
		return;
	}

	const relatedRoots = Array.from(new Set([
		...document.querySelectorAll('#secondary'),
		...document.querySelectorAll('#related'),
		...document.querySelectorAll('ytd-watch-next-secondary-results-renderer'),
		...document.querySelectorAll('ytm-watch-next-secondary-results-renderer'),
		...document.querySelectorAll('ytm-item-section-renderer[section-identifier="related-items"]')
	]));

	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="sidebar-recommended"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	if (relatedRoots.length === 0) return;

	const hiddenAttr = 'sidebar-recommended';
	let recsCount = 0;

	document.querySelectorAll(
		'#secondary yt-chip-cloud-renderer, #secondary yt-related-chip-cloud-renderer, #secondary ytd-feed-filter-chip-bar-renderer, ' +
		'#related yt-chip-cloud-renderer, #related yt-related-chip-cloud-renderer, #related ytd-feed-filter-chip-bar-renderer, ' +
		'ytd-watch-next-secondary-results-renderer yt-chip-cloud-renderer, ytd-watch-next-secondary-results-renderer yt-related-chip-cloud-renderer, ytd-watch-next-secondary-results-renderer ytd-feed-filter-chip-bar-renderer'
	).forEach(el => {
		if (!el.hasAttribute('data-lockedin-hidden')) {
			el.style.display = 'none';
			el.setAttribute('data-lockedin-hidden', hiddenAttr);
		}
	});

	relatedRoots.forEach((sidebar) => {
		const contentSelectors = [
			'ytd-compact-video-renderer',
			'ytd-compact-movie-renderer',
			'ytd-compact-radio-renderer',
			'ytd-compact-autoplay-renderer',
			'ytd-reel-item-renderer',
			'ytd-video-renderer',
			'yt-lockup-view-model',
			'ytd-reel-shelf-renderer',
			'ytd-item-section-renderer > #contents',
			'ytm-compact-video-renderer',
			'ytm-video-with-context-renderer',
			'ytm-item-section-renderer',
			'ytm-compact-autoplay-renderer'
		];

		contentSelectors.forEach(selector => {
			sidebar.querySelectorAll(selector).forEach(el => {
				if (el.hasAttribute('data-lockedin-hidden')) return;
				if (el.closest('ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, ytm-playlist-panel-renderer')) return;
				if (el.closest('ytd-engagement-panel-section-list-renderer, ytm-engagement-panel-section-list-renderer') ||
						el.hasAttribute('target-id') ||
						el.closest('[target-id]')) return;

				el.style.display = 'none';
				el.setAttribute('data-lockedin-hidden', hiddenAttr);
				recsCount++;
			});
		});

		const mobileRelatedContainers = sidebar.querySelectorAll('#related, #items, ytm-watch-next-secondary-results-renderer, ytd-watch-next-secondary-results-renderer');
		mobileRelatedContainers.forEach(container => {
			const hasVideos = container.querySelector('ytd-compact-video-renderer, ytd-video-renderer, yt-lockup-view-model, ytd-reel-shelf-renderer, ytm-compact-video-renderer, ytm-video-with-context-renderer');
			if (hasVideos && !container.hasAttribute('data-lockedin-hidden')) {
				container.style.display = 'none';
				container.setAttribute('data-lockedin-hidden', hiddenAttr);
			}
		});

		sidebar.querySelectorAll('ytm-item-section-renderer').forEach(section => {
			if (section.querySelector('ytm-video-with-context-renderer, ytm-compact-video-renderer')) {
				if (!section.hasAttribute('data-lockedin-hidden')) {
					section.style.display = 'none';
					section.setAttribute('data-lockedin-hidden', hiddenAttr);
				}
			}
		});
	});

	if (recsCount > 0) {
		trackStat('recs', recsCount);
	}

	collapseSidebarIfEmpty();
	ensureCommentsVisible();
	ensureTranscriptPanelVisible();
}

function hideAll(shouldHide) {
	if (!window.location.href.includes('/watch')) {
		return;
	}

	hideRecommendedVideos(shouldHide);
	hideSidebarShorts(shouldHide);
	hidePlaylists(shouldHide);
}

function hideSidebarShorts(shouldHide) {
	if (!window.location.href.includes('/watch')) {
		return;
	}

	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="sidebar-shorts"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		collapseSidebarIfEmpty();
		return;
	}

	let shortsCount = 0;
	const shortsSelectors = [
		'ytd-compact-video-renderer[is-shorts]',
		'ytd-reel-item-renderer',
		'ytd-reel-shelf-renderer',
		'ytm-reel-item-renderer',
		'ytm-reel-shelf-renderer',
		'ytm-shorts-lockup-view-model',
		'ytm-shorts-lockup-view-model-v2'
	];

	shortsSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(el => {
			if (el.closest('ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, ytm-playlist-panel-renderer')) return;
			const inSidebar = el.closest('#secondary, #related, ytd-watch-next-secondary-results-renderer, ytm-watch-next-secondary-results-renderer, ytm-item-section-renderer[section-identifier="related-items"]');
			if (!inSidebar) return;

			if (!el.hasAttribute('data-lockedin-hidden')) {
				el.style.display = 'none';
				el.setAttribute('data-lockedin-hidden', 'sidebar-shorts');
				shortsCount++;
			}
		});
	});

	document.querySelectorAll('ytd-compact-video-renderer, ytm-compact-video-renderer').forEach(el => {
		if (el.hasAttribute('data-lockedin-hidden')) return;
		if (el.closest('ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, ytm-playlist-panel-renderer')) return;
		const inSidebar = el.closest('#secondary, #related, ytd-watch-next-secondary-results-renderer, ytm-watch-next-secondary-results-renderer, ytm-item-section-renderer[section-identifier="related-items"]');
		if (!inSidebar) return;

		const shortsLink = el.querySelector('a[href*="/shorts/"]');
		const shortsOverlay = el.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"], [overlay-style="SHORTS"]');
		const shortsBadge = el.querySelector('[aria-label*="Shorts" i], [title*="Shorts" i]');

		if (shortsLink || shortsOverlay || shortsBadge) {
			el.style.display = 'none';
			el.setAttribute('data-lockedin-hidden', 'sidebar-shorts');
			shortsCount++;
		}
	});

	document.querySelectorAll('ytd-video-renderer, ytm-video-with-context-renderer').forEach(el => {
		if (el.hasAttribute('data-lockedin-hidden')) return;
		if (el.closest('ytd-playlist-panel-renderer, ytd-playlist-panel-view-model, ytm-playlist-panel-renderer')) return;
		const inSidebar = el.closest('#secondary, #related, ytd-watch-next-secondary-results-renderer, ytm-watch-next-secondary-results-renderer, ytm-item-section-renderer[section-identifier="related-items"]');
		if (!inSidebar) return;

		const shortsLink = el.querySelector('a[href*="/shorts/"]');
		const shortsOverlay = el.querySelector('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"], [overlay-style="SHORTS"]');

		if (shortsLink || shortsOverlay) {
			el.style.display = 'none';
			el.setAttribute('data-lockedin-hidden', 'sidebar-shorts');
			shortsCount++;
		}
	});

	if (shortsCount > 0) {
		trackStat('shorts', shortsCount);
	}

	collapseSidebarIfEmpty();
}

function collapseSidebarIfEmpty() {
	const sidebar = document.querySelector('#secondary') ||
									document.querySelector('ytm-watch-next-secondary-results-renderer');
	if (!sidebar) return;
	const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer, ytd-transcript-segment-list-renderer');
	if (transcriptPanel) {
		ensureTranscriptPanelVisible();
		return;
	}
	sidebar.style.display = '';
}

function ensureCommentsVisible() {
	if (latestSyncedSettings && latestSyncedSettings.hideComments) {
		return;
	}

	const comments = document.querySelector('#comments, ytd-comments');
	if (comments) {
		comments.style.display = '';
		comments.removeAttribute('hidden');
	}
}

function ensureTranscriptPanelVisible() {
	const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer, ytd-transcript-segment-list-renderer');
	if (!transcriptPanel) return;

	const sidebar = document.querySelector('#secondary');
	if (sidebar) {
		sidebar.style.display = '';
		sidebar.removeAttribute('hidden');
	}

	restoreTranscriptVisibility();
}

function restoreTranscriptVisibility() {
	if (!window.location.pathname.includes('/watch?')) return;
	const panels = document.querySelectorAll('ytd-engagement-panel-section-list-renderer, ytd-transcript-segment-list-renderer');
	panels.forEach(panel => {
		panel.style.display = '';
		panel.removeAttribute('hidden');
		let parent = panel.parentElement;
		while (parent && parent !== document.body) {
			parent.style.display = '';
			parent.removeAttribute('hidden');
			parent = parent.parentElement;
		}
	});
}

let transcriptObserver = null;

function startTranscriptObserver() {
	if (transcriptObserver) return;
	transcriptObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue;
				if (node.matches('ytd-engagement-panel-section-list-renderer, ytd-transcript-segment-list-renderer') ||
						node.querySelector('ytd-engagement-panel-section-list-renderer, ytd-transcript-segment-list-renderer')) {
					ensureTranscriptPanelVisible();
					return;
				}
			}
		}
	});
	transcriptObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
}

function stopTranscriptObserver() {
	if (transcriptObserver) {
		transcriptObserver.disconnect();
		transcriptObserver = null;
	}
}

function hideLiveChat(shouldHide) {
	toggleElement('#chat', shouldHide);
}

function hideComments(shouldHide) {
	if (!shouldHide) {
		toggleElement('#comments', false);
		toggleElement('ytd-comments', false);
		toggleElement('ytd-comments#comments', false);
		toggleAllElements('ytd-comments-entry-point-header-renderer', false);
		toggleAllElements('ytm-comments-entry-point-header-renderer', false);
		toggleAllElements('ytm-comment-thread-renderer', false);
		toggleAllElements('ytm-comments-section-renderer', false);
		toggleAllElements('ytm-structured-description-content-renderer', false);
		return;
	}

	toggleElement('#comments', true);
	toggleElement('ytd-comments', true);
	toggleElement('ytd-comments#comments', true);
	toggleAllElements('ytd-comments-entry-point-header-renderer', true);
	toggleAllElements('ytm-comments-entry-point-header-renderer', true);
	toggleAllElements('ytm-comment-thread-renderer', true);
	toggleAllElements('ytm-comments-section-renderer', true);
	toggleAllElements('ytm-structured-description-content-renderer', true);
}

function hideEndCards(shouldHide) {
	if (!window.location.pathname.startsWith('/watch')) return;

	const player = document.querySelector('#movie_player');
	if (!player) return;
	const hiddenAttr = 'endcards';
	const prevStyleAttr = 'data-lockedin-prev-style';

	const markHidden = (el) => {
		if (!el) return;
		const existingHidden = el.getAttribute('data-lockedin-hidden');
		if (existingHidden && existingHidden !== hiddenAttr) return;
		if (existingHidden === hiddenAttr) return;

		const previousStyle = el.getAttribute('style');
		el.setAttribute(prevStyleAttr, previousStyle === null ? '__NONE__' : previousStyle);
		el.setAttribute('data-lockedin-hidden', hiddenAttr);
		el.style.display = 'none';
	};

	if (!shouldHide) {
		player.querySelectorAll('[data-lockedin-hidden="endcards"]').forEach(el => {
			const previousStyle = el.getAttribute(prevStyleAttr);
			if (previousStyle === '__NONE__') {
				el.removeAttribute('style');
			} else if (previousStyle !== null) {
				el.setAttribute('style', previousStyle);
			} else {
				el.style.display = '';
				el.style.visibility = '';
				el.style.opacity = '';
			}

			el.removeAttribute(prevStyleAttr);
			el.removeAttribute('data-lockedin-hidden');
		});

		return;
	}

	let endCardsCount = 0;
	player.querySelectorAll('.ytp-ce-element:not([data-lockedin-counted])').forEach(el => {
		if (el.offsetParent !== null) {
			endCardsCount++;
			el.setAttribute('data-lockedin-counted', 'true');
		}
	});
	if (endCardsCount > 0) {
		trackStat('endcards', endCardsCount);
	}

	const hideSelectors = [
		'.ytp-ce-element',
		'.ytp-ce-video',
		'.ytp-ce-playlist',
		'.ytp-ce-channel',
		'.ytp-ce-website',
		'.ytp-ce-covering-overlay',
		'.ytp-ce-shadow',
		'.ytp-ce-size-1280',
		'.ytp-ce-size-853',
		'.ytp-show-tiles',
		'.ytp-endscreen-content',
		'.ytp-ce-element-show',
		'.ytp-suggestion-set',
		'.ytp-videowall-still',
		'.html5-endscreen',
		'.ytp-endscreen-previous',
		'.ytp-endscreen-next',
		'.ytp-videowall-still-image',
		'.videowall-endscreen'
	];

	hideSelectors.forEach((selector) => {
		player.querySelectorAll(selector).forEach(markHidden);
	});

	player.querySelectorAll('.html5-endscreen, .ytp-endscreen-content, .ytp-ce-covering-overlay').forEach(el => {
		markHidden(el);
		el.style.visibility = 'hidden';
		el.style.opacity = '0';
	});
}
