// ===== SIDEBAR MODULE =====

let sidebarObserver = null;
let secondaryObserver = null;
let sidebarHideRetryTimers = [];
const GUIDE_HIDE_ATTR = 'data-lockedin-guide';
const GUIDE_HOME_SELECTORS = [
	'ytd-guide-entry-renderer a[href="/"]',
	'ytd-guide-entry-renderer a[href="/home"]',
	'ytd-guide-entry-renderer a[title="Home"]',
	'ytd-guide-entry-renderer #endpoint[title="Home"]',
	'ytd-mini-guide-entry-renderer a[href="/"]',
	'ytd-mini-guide-entry-renderer a[href="/home"]',
	'ytd-mini-guide-entry-renderer a[title="Home"]',
	'ytd-mini-guide-entry-renderer #endpoint[title="Home"]'
];
const GUIDE_SHORTS_SELECTORS = [
	'ytd-guide-entry-renderer a[href^="/shorts"]',
	'ytd-guide-entry-renderer a[title="Shorts"]',
	'ytd-guide-entry-renderer #endpoint[title="Shorts"]',
	'ytd-mini-guide-entry-renderer a[href^="/shorts"]',
	'ytd-mini-guide-entry-renderer a[title="Shorts"]',
	'ytd-mini-guide-entry-renderer #endpoint[title="Shorts"]'
];

const guideObserver = new MutationObserver(() => {
	if (latestSyncedSettings.extensionEnabled === false) return;
	updateGuideVisibility();
	// If cleanSidebar is on, hide all three; otherwise use individual settings
	if (latestSyncedSettings.cleanSidebar) {
		hideExplore(true);
		hideMoreFromYT(true);
		hideSubscriptions(true);
	} else {
		hideExplore(latestSyncedSettings.hideExplore);
		hideMoreFromYT(latestSyncedSettings.hideMoreFromYT);
		hideSubscriptions(latestSyncedSettings.hideSubscriptions);
	}
});

function applyInstantShortsCssFromCache() {
	setInstantHiding(
		latestSyncedSettings.hideShortsHomepage,
		latestSyncedSettings.hideShortsSearch,
		latestSyncedSettings.hideShortsGlobally
	);
}

function applyInstantRecsCssFromCache() {
	setInstantRecsHiding(
		latestSyncedSettings.hideRecommended,
		latestSyncedSettings.hideSidebar
	);
}

function applyRedirectStateFromCache() {
	const shouldRedirect =
		latestSyncedSettings.hideFeed && latestSyncedSettings.redirectToSubs;
	redirectToSubscriptions(shouldRedirect);
}

function ensureSidebarObserver(active) {
	if (!active) {
		if (sidebarObserver) {
			sidebarObserver.disconnect();
			sidebarObserver = null;
		}
		if (secondaryObserver) {
			secondaryObserver.disconnect();
			secondaryObserver = null;
		}
		sidebarHideRetryTimers.forEach(clearTimeout);
		sidebarHideRetryTimers = [];
		return;
	}

	if (sidebarObserver) return;

	const sidebarCallback = debounce(() => {
		if (latestSyncedSettings.extensionEnabled === false) return;
		if (latestSyncedSettings.hideSidebar) {
			hideAll(true);
		} else if (latestSyncedSettings.hideRecommended) {
			hideRecommendedVideos(true);
			hideSidebarShorts(latestSyncedSettings.hideSidebarShorts);
		}
		ensureTranscriptPanelVisible();
	}, 80);

	sidebarObserver = new MutationObserver(sidebarCallback);
	sidebarObserver.observe(document.body, { childList: true, subtree: true });
	sidebarCallback();

	const attachSecondaryObserver = () => {
		const secondary = document.querySelector('#secondary');
		if (!secondary) return false;
		const secondaryCallback = debounce(() => {
			if (latestSyncedSettings.extensionEnabled === false) return;
			if (latestSyncedSettings.hideSidebar) {
				hideAll(true);
			} else if (latestSyncedSettings.hideRecommended) {
				hideRecommendedVideos(true);
				hideSidebarShorts(latestSyncedSettings.hideSidebarShorts);
			}
			ensureTranscriptPanelVisible();
		}, 50);
		secondaryObserver = new MutationObserver(secondaryCallback);
		secondaryObserver.observe(secondary, { childList: true, subtree: true });
		secondaryCallback();
		return true;
	};

	if (!attachSecondaryObserver()) {
		setTimeout(attachSecondaryObserver, 300);
		setTimeout(attachSecondaryObserver, 900);
	}
}

function scheduleSidebarHideRetries(settings) {
	sidebarHideRetryTimers.forEach(clearTimeout);
	sidebarHideRetryTimers = [];
	if (settings.hideSidebar || settings.hideRecommended) {
		const actions = () => {
			if (settings.hideSidebar) {
				hideAll(true);
			} else if (settings.hideRecommended) {
				hideRecommendedVideos(true);
				hideSidebarShorts(settings.hideSidebarShorts);
			}
			ensureTranscriptPanelVisible();
		};
		[250, 800, 1800, 3200].forEach((ms) => {
			sidebarHideRetryTimers.push(setTimeout(actions, ms));
		});
	}
}

function toggleGuideSelectors(selectors, marker, shouldHide) {
	if (!selectors || selectors.length === 0) return;
	const combinedSelector = selectors.join(',');
	document.querySelectorAll(combinedSelector).forEach((link) => {
		const container = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
		if (!container) return;
		if (shouldHide) {
			container.style.display = 'none';
			container.setAttribute('hidden', '');
			container.setAttribute(GUIDE_HIDE_ATTR, marker);
		} else if (container.getAttribute(GUIDE_HIDE_ATTR) === marker) {
			container.style.display = '';
			container.removeAttribute('hidden');
			container.removeAttribute(GUIDE_HIDE_ATTR);
		}
	});
}

function updateGuideVisibility() {
	const enabled = latestSyncedSettings.extensionEnabled !== false;
	const hideHomeTab = enabled && (
		latestSyncedSettings.hideFeed ||
		latestSyncedSettings.redirectToSubs
	);
	const hideShortsTab = enabled && (
		latestSyncedSettings.hideShortsHomepage ||
		latestSyncedSettings.hideShortsGlobally ||
		latestSyncedSettings.hideShortsSearch ||
		latestSyncedSettings.redirectShorts
	);
	setRootFlag('data-lockedin-hide-home', hideHomeTab);
	setRootFlag('data-lockedin-hide-shorts-tab', hideShortsTab);
	toggleGuideSelectors(GUIDE_HOME_SELECTORS, 'home', hideHomeTab);
	toggleGuideSelectors(GUIDE_SHORTS_SELECTORS, 'shorts', hideShortsTab);
}

function observeGuideContainers() {
	document.querySelectorAll('ytd-guide-renderer, ytd-mini-guide-renderer').forEach((container) => {
		guideObserver.observe(container, { childList: true, subtree: true });
	});
}

function hideSubscriptions(shouldHide) {
	const subscriptionsSection = document.querySelector('ytd-guide-section-renderer:has(a#endpoint[href^="/feed/subscriptions"])');

	if (!shouldHide) {
		if (subscriptionsSection && subscriptionsSection.hasAttribute('data-lockedin-hidden')) {
			subscriptionsSection.style.display = '';
			subscriptionsSection.removeAttribute('data-lockedin-hidden');
		}
		(subscriptionsSection ? subscriptionsSection.querySelectorAll('ytd-guide-entry-renderer[data-lockedin-hidden="subscription"]') : document.querySelectorAll('ytd-guide-entry-renderer[data-lockedin-hidden="subscription"]')).forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	if (subscriptionsSection && !subscriptionsSection.hasAttribute('data-lockedin-hidden')) {
		subscriptionsSection.style.display = 'none';
		subscriptionsSection.setAttribute('data-lockedin-hidden', 'subscriptions-section');
	}

	(subscriptionsSection ? subscriptionsSection.querySelectorAll('ytd-guide-entry-renderer:has(#endpoint[href^="/@"]), ytd-guide-entry-renderer:has(#endpoint[href^="/channel/"]), ytd-guide-entry-renderer:has(#endpoint[href^="/c/"])') : document.querySelectorAll('ytd-guide-entry-renderer:has(#endpoint[href^="/@"]), ytd-guide-entry-renderer:has(#endpoint[href^="/channel/"]), ytd-guide-entry-renderer:has(#endpoint[href^="/c/"])')).forEach(el => {
		const link = el.querySelector('a[href^="/@"], a[href^="/channel/"], a[href^="/c/"]');
		if (link && !el.hasAttribute('data-lockedin-hidden')) {
			el.style.display = 'none';
			el.setAttribute('data-lockedin-hidden', 'subscription');
		}
	});
}

function hideExplore(shouldHide) {
	const exploreTitles = [
		'explore', 'erkunden', 'entdecken', 'explorer', 'explorar', 'esplora', '탐색', '探索', '探索', 'ανακάλυψε', 'explorar', 'explorar',
		'explorar', 'अन्वेषण', 'استكشاف', 'अनुसंधान करें', '탐험', 'разное', 'обзор', 'descobrir', 'explorar', 'exploare', 'explorar',
		'felfedezés', 'utforsk', 'utforska', 'opdag', 'utforska', 'utforsking'
	];
	const exploreHrefs = [
		'/feed/explore', '/feed/trending', '/feed/storefront',
		'/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',
		'/channel/UCq-Fj5jknLsUf-MWSy4_brA',
		'/channel/UClgRkhTL3_hImCAmdLfDE4g',
		'/channel/UCiGm_E4ZwYSHV3bcW1pnSeQ'
	];
	const youTitles = [
		'you', 'du', 'dir', 'dich', 'vous', 'toi', 'usted', 'tú', 'vos', 'você', 'tu', 'sei', 'tuo', 'voi', 'আপনি', 'আপনার', 'आप',
		'आपका', 'तुम', 'तुम्हारा', 'آپ', 'آپ کا', 'ты', 'тебе', 'вас', 'ваши', 'あなた', '君', '당신', '너', 'anda', 'kamu', 'anda',
		'você', 'vous', 'usted', 'vous', 'ты', 'вы', 'तपाईं', 'ਤੁਸੀਂ', 'คุณ', 'เธอ', 'তুমি', 'तुम', 'ты', 'siz', 'sen', 'voi'
	];
	const youHrefs = [
		'/feed/you', '/feed/library', '/feed/history', '/feed/subscriptions', '/playlist?list=WL', '/account', '/paid_memberships'
	];

	document.querySelectorAll('ytd-guide-section-renderer').forEach(section => {
		const title = section.querySelector('#guide-section-title');
		const titleText = title?.textContent?.trim().toLowerCase() || '';
		const hasTitleMatch = exploreTitles.includes(titleText);
		const hasExploreLink = Array.from(section.querySelectorAll('a[href]')).some((a) => exploreHrefs.some((h) => a.getAttribute('href')?.startsWith(h)));
		const isYouSection = youTitles.includes(titleText) || Array.from(section.querySelectorAll('a[href]')).some((a) => youHrefs.some((h) => a.getAttribute('href')?.startsWith(h)));
		if ((hasTitleMatch || hasExploreLink) && !isYouSection) {
			if (shouldHide) {
				section.style.display = 'none';
				section.setAttribute('data-lockedin-hidden', 'explore-section');
			} else if (section.getAttribute('data-lockedin-hidden') === 'explore-section') {
				section.style.display = '';
				section.removeAttribute('data-lockedin-hidden');
			}
		}
	});
}

function hideMoreFromYT(shouldHide) {
	if (!shouldHide) {
		document.querySelectorAll('[data-lockedin-hidden="more-from-yt"]').forEach(el => {
			el.removeAttribute('hidden');
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		document.querySelectorAll('[data-lockedin-hidden="more-from-yt-spacer"]').forEach(el => {
			el.style.display = '';
			el.removeAttribute('data-lockedin-hidden');
		});
		return;
	}

	const moreTitles = [
		'more from youtube', 'mehr von youtube', 'plus de youtube', 'más de youtube', 'altro da youtube', 'mais do youtube', 'plus de youtube',
		' المزيد من youtube', 'youtube’dan daha fazla', 'youtube에서 더보기', '來自 youtube', '更多內容來自 youtube', 'youtube からのおすすめ',
		'youtubeから', 'więcej z youtube', 'עוד מיוטיוב', 'עוד מ- youtube', 'עוד מ-youtube', 'больше от youtube', 'більше від youtube'
	];
	const moreHrefs = [
		'/premium', 'studio.youtube.com', 'music.youtube.com', 'youtubekids.com', '/gaming', '/fashion', '/shopping', '/podcasts', '/news'
	];
	const youTitles = [
		'you', 'du', 'dir', 'dich', 'vous', 'toi', 'usted', 'tú', 'vos', 'você', 'tu', 'sei', 'tuo', 'voi', 'আপনি', 'আপনার', 'आप',
		'आपका', 'तुम', 'तुम्हारा', 'آپ', 'آپ کا', 'ты', 'тебе', 'вас', 'ваши', 'あなた', '君', '당신', '너', 'anda', 'kamu', 'anda',
		'você', 'vous', 'usted', 'vous', 'ты', 'вы', 'तपाईं', 'ਤੁਸੀਂ', 'คุณ', 'เธอ', 'তুমি', 'तुम', 'ты', 'siz', 'sen', 'voi'
	];
	const youHrefs = ['/feed/you', '/feed/library', '/feed/history', '/feed/subscriptions', '/playlist?list=WL', '/account', '/paid_memberships'];

	document.querySelectorAll('ytd-guide-section-renderer').forEach(section => {
		const title = section.querySelector('#guide-section-title');
		const titleText = title?.textContent?.trim().toLowerCase() || '';
		const hasTitleMatch = moreTitles.includes(titleText);
		const hasMoreLink = Array.from(section.querySelectorAll('a[href]')).some((a) => moreHrefs.some((h) => a.getAttribute('href')?.includes(h)));
		const hasYouIndicator = youTitles.includes(titleText) || Array.from(section.querySelectorAll('a[href]')).some((a) => youHrefs.some((h) => a.getAttribute('href')?.startsWith(h) || a.getAttribute('href')?.includes(h)));
		if ((hasTitleMatch || hasMoreLink) && !hasYouIndicator) {
			if (!section.hasAttribute('data-lockedin-hidden')) {
				section.setAttribute('hidden', '');
				section.setAttribute('data-lockedin-hidden', 'more-from-yt');
				section.style.display = 'none';
			}
			const next = section.nextElementSibling;
			if (next && next.tagName && next.tagName.toLowerCase() === 'ytd-guide-collapsible-entry-renderer') {
				next.style.display = 'none';
				next.setAttribute('data-lockedin-hidden', 'more-from-yt-spacer');
			}
		}
	});
}
