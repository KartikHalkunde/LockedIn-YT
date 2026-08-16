// ===== SUBSCRIPTIONS MODULE =====

function hideMostRelevantSubscriptions(shouldHide) {
	const hiddenAttr = 'subscriptions-most-relevant';

	if (!shouldHide) {
		document.querySelectorAll(`[data-lockedin-hidden="${hiddenAttr}"]`).forEach((el) => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	if (!window.location.pathname.startsWith('/feed/subscriptions')) {
		return;
	}

	const sections = document.querySelectorAll('ytd-rich-section-renderer');
	sections.forEach((section) => {
		const shelf = section.querySelector('ytd-rich-shelf-renderer[has-expansion-button][restrict-contents-overflow]');
		const hasShelfHeader = !!section.querySelector('#rich-shelf-header, #rich-shelf-header-container');
		const hasNavButtons = !!section.querySelector('#previous-button, #next-button');
		const hasShelfItems = !!section.querySelector('ytd-rich-item-renderer[is-shelf-item], ytd-rich-item-renderer[lockup]');
		const hasShowMoreButton = !!section.querySelector('.expand-collapse-button, .button-container ytd-button-renderer');

		if (shelf && hasShelfHeader && hasNavButtons && hasShelfItems && hasShowMoreButton && !section.hasAttribute('data-lockedin-hidden')) {
			section.style.display = 'none';
			section.setAttribute('data-lockedin-hidden', hiddenAttr);
		}
	});
}

function hideSubscriptionsLiveStreams(shouldHide) {
	const hiddenAttr = 'subscriptions-live-streams';

	if (!shouldHide) {
		document.querySelectorAll(`[data-lockedin-hidden="${hiddenAttr}"]`).forEach((el) => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	if (!window.location.pathname.startsWith('/feed/subscriptions')) {
		return;
	}

	// Helper to hide a lockup's closest rich-item wrapper
	function hideItem(el) {
		const wrapper = el.closest('ytd-rich-item-renderer') || el.closest('ytd-grid-video-renderer');
		const target = wrapper || el;
		if (!target.hasAttribute('data-lockedin-hidden')) {
			target.style.display = 'none';
			target.setAttribute('data-lockedin-hidden', hiddenAttr);
		}
	}

	// --- LIVE streams ---
	// New layout: badge-shape inside yt-lockup-view-model uses class ytBadgeShapeThumbnailLive
	document.querySelectorAll('badge-shape.ytBadgeShapeThumbnailLive').forEach((badge) => {
		hideItem(badge);
	});

	// Old layout fallback: ytd-thumbnail-overlay-time-status-renderer with overlay-style="LIVE"
	document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="LIVE"]').forEach((badge) => {
		hideItem(badge);
	});

	// --- Upcoming / Scheduled streams ---
	// Upcoming badges use ytBadgeShapeThumbnailDefault (same as regular videos) so check text content
	document.querySelectorAll('badge-shape.ytBadgeShapeThumbnailDefault').forEach((badge) => {
		const text = badge.querySelector('.ytBadgeShapeText')?.textContent?.trim() || '';
		if (text === 'Upcoming' || text === 'Premieres' || /^Premieres/i.test(text)) {
			hideItem(badge);
		}
	});

	// Old layout fallback: overlay-style="UPCOMING"
	document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]').forEach((badge) => {
		hideItem(badge);
	});
}
