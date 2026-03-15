// ===== SHARED SELECTORS =====

function isMobileYouTube() {
	if (window.location.hostname === 'm.youtube.com') {
		return true;
	}

	if (document.querySelector('ytm-app')) {
		return true;
	}

	const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	const isMobileViewport = window.innerWidth <= 768;

	return isMobileUA && isMobileViewport && document.querySelector('ytm-browse, ytm-watch');
}

let IS_MOBILE = null;
function getEnvironment() {
	if (IS_MOBILE === null) {
		IS_MOBILE = isMobileYouTube();
	}
	return IS_MOBILE ? 'mobile' : 'desktop';
}

const SELECTORS = {
	desktop: {
		homeRenderer: 'ytd-rich-grid-renderer',
		videoRenderer: 'ytd-rich-item-renderer',
		gridVideoRenderer: 'ytd-grid-video-renderer',
		shortsShelf: 'ytd-reel-shelf-renderer',
		shortsRenderer: 'ytd-reel-item-renderer',
		sidebar: '#secondary',
		sidebarInner: '#secondary-inner',
		sidebarVideos: 'ytd-compact-video-renderer',
		sidebarShorts: 'ytd-reel-item-renderer',
		autoplay: 'ytd-compact-autoplay-renderer',
		playlistPanel: 'ytd-playlist-panel-renderer',
		comments: '#comments, ytd-comments',
		communityPost: 'ytd-backstage-post-thread-renderer',
		searchRenderer: 'ytd-video-renderer'
	},
	mobile: {
		homeRenderer: 'ytm-browse',
		videoRenderer: 'ytm-video-with-context-renderer',
		gridVideoRenderer: 'ytm-grid-video-renderer',
		shortsShelf: 'ytm-reel-shelf-renderer',
		shortsRenderer: 'ytm-reel-item-renderer',
		sidebar: '#related, ytm-watch-next-secondary-results-renderer',
		sidebarInner: null,
		sidebarVideos: 'ytm-compact-video-renderer, ytm-video-with-context-renderer',
		sidebarShorts: 'ytm-reel-item-renderer',
		autoplay: 'ytm-compact-autoplay-renderer',
		playlistPanel: 'ytm-playlist-panel-renderer',
		comments: 'ytm-comments-entry-point-header-renderer, ytm-comment-thread-renderer',
		communityPost: 'ytm-backstage-post-renderer',
		searchRenderer: 'ytm-compact-video-renderer'
	}
};

function getSelector(key) {
	const env = getEnvironment();
	return SELECTORS[env][key];
}

function getAllSelectors(key) {
	const desktop = SELECTORS.desktop[key];
	const mobile = SELECTORS.mobile[key];

	if (!desktop && !mobile) return '';
	if (!desktop) return mobile;
	if (!mobile) return desktop;

	return `${desktop}, ${mobile}`;
}

function normalizePathname(pathname) {
	if (!pathname) return '/';
	if (pathname.length > 1 && pathname.endsWith('/')) {
		return pathname.replace(/\/+$/, '');
	}
	return pathname;
}

function isHomePath(pathname = window.location.pathname) {
	const normalized = normalizePathname(pathname);
	return normalized === '/' || normalized === '/home';
}

function isSubscriptionsPath(pathname = window.location.pathname) {
	return normalizePathname(pathname) === '/feed/subscriptions';
}

function isHomeLikeSurface(pathname = window.location.pathname) {
	const normalized = normalizePathname(pathname);
	if (isHomePath(normalized) || isSubscriptionsPath(normalized)) {
		return true;
	}
	return normalized === '/feed/trending';
}
