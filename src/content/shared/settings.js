// ===== SHARED SETTINGS =====

const SUPPORTED_LANGUAGES = ['en', 'es', 'hi', 'pt', 'fr', 'de'];
const FALLBACK_LANGUAGE = 'en';

const I18N_STRINGS = {
	en: {
		'placeholder.alt': 'Stay Focused!'
	},
	es: {
		'placeholder.alt': '¡Concéntrate!'
	},
	hi: {
		'placeholder.alt': 'ध्यान केंद्रित रखें!'
	},
	pt: {
		'placeholder.alt': 'Mantenha o foco!'
	},
	fr: {
		'placeholder.alt': 'Reste concentré !'
	},
	de: {
		'placeholder.alt': 'Bleib fokussiert!'
	}
};

let activeLanguage = FALLBACK_LANGUAGE;

function formatTemplate(template, replacements) {
	if (!template || !replacements) return template;
	return Object.keys(replacements).reduce((result, key) => {
		const value = replacements[key];
		return result.replace(new RegExp(`{${key}}`, 'g'), value);
	}, template);
}

function getBrowserLanguage() {
	try {
		if (browser && browser.i18n && typeof browser.i18n.getUILanguage === 'function') {
			return browser.i18n.getUILanguage();
		}
	} catch (error) {
		console.debug('LockedIn: Unable to detect browser language', error);
	}
	if (typeof navigator !== 'undefined' && navigator.language) {
		return navigator.language;
	}
	return FALLBACK_LANGUAGE;
}

function resolveLanguagePreference(preferred) {
	if (preferred && preferred !== 'auto' && SUPPORTED_LANGUAGES.includes(preferred)) {
		return preferred;
	}
	const browserLang = (getBrowserLanguage() || '').toLowerCase();
	const exactMatch = SUPPORTED_LANGUAGES.find((code) => browserLang === code);
	if (exactMatch) {
		return exactMatch;
	}
	const partialMatch = SUPPORTED_LANGUAGES.find((code) => browserLang.startsWith(`${code}-`));
	return partialMatch || FALLBACK_LANGUAGE;
}

function setActiveLanguage(languageCode) {
	activeLanguage = SUPPORTED_LANGUAGES.includes(languageCode) ? languageCode : FALLBACK_LANGUAGE;
}

function translate(key, replacements = null, languageCode = activeLanguage) {
	if (!key) {
		return '';
	}
	const languagePack = I18N_STRINGS[languageCode] || I18N_STRINGS[FALLBACK_LANGUAGE] || {};
	let template = languagePack[key];
	if (template === undefined) {
		const fallbackPack = I18N_STRINGS[FALLBACK_LANGUAGE] || {};
		template = fallbackPack[key] || '';
	}
	if (!template) {
		return '';
	}
	return replacements ? formatTemplate(template, replacements) : template;
}

async function initLocalization() {
	try {
		// Use readStorageArea (via getStorageApi), not a raw `browser` reference:
		// settings.js loads before index.js aliases `browser` to `chrome`, so a
		// direct `browser.storage` call throws on Chromium. Wait for the managed
		// overlay too so a managed language wins over sync.
		const [stored] = await Promise.all([
			readStorageArea('sync', 'language'),
			managedOverlayReady
		]);
		const preferred = (managedOverlayCache && managedOverlayCache.language) || stored.language || 'auto';
		setActiveLanguage(resolveLanguagePreference(preferred));
	} catch (error) {
		console.debug('LockedIn: Unable to initialize localization', error);
		setActiveLanguage(FALLBACK_LANGUAGE);
	}
}

function handleLanguagePreferenceChange(preferred) {
	setActiveLanguage(resolveLanguagePreference(preferred || 'auto'));
}

const DEFAULT_SETTINGS = {
	hideFeed: false,
	redirectToSubs: false,
	hideMostRelevantSubscriptions: false,
	hideShortsHomepage: false,
	hideExploreMoreTopics: false,
	cleanHomepageFeed: false,
	hideCommunityPosts: false,
	hideFeaturedContent: false,
	hideMembersOnly: false,
	hidePlayables: false,
	cleanSidebar: false,
	hideShortsGlobally: false,
	redirectShorts: false,
	hideVideoThumbnails: false,
	hideSidebar: false,
	hideRecommended: false,
	hideSidebarShorts: false,
	hideLiveChat: false,
	hideEndCards: false,
	disableAutoplay: false,
	hideComments: false,
	hideSearchRecommended: false,
	hideShortsSearch: false,
	hideExplore: false,
	hideMoreFromYT: false,
	hidePlaylists: false,
	hideSubscriptions: false,
	hideFeedQuote: false,
	extensionEnabled: true
};

let latestSyncedSettings = { ...DEFAULT_SETTINGS };

// ===== MANAGED (ENTERPRISE POLICY) STORAGE =====
// Any key present in browser.storage.managed is BOTH forced and locked: an
// administrator pushes settings via enterprise policy and the user cannot
// change them. Effective precedence is: managed (wins) > sync > DEFAULT_SETTINGS.
// This module is loaded first in the content_scripts list, so these helpers are
// available to every other content script.

let managedOverlayCache = {};
let managedLockedKeys = new Set();

// Resolve the extension storage API at call time (not load time). In Chromium,
// `browser` is only aliased to `chrome` later by content/index.js, so we must
// tolerate `browser` being undefined here.
function getStorageApi() {
	if (typeof browser !== 'undefined' && browser && browser.storage) return browser;
	if (typeof chrome !== 'undefined' && chrome && chrome.storage) return chrome;
	return null;
}

// Read a storage area tolerating both promise (Firefox) and callback (Chromium)
// styles. Never throws: a missing area or absent policy resolves to {}.
function readStorageArea(areaName, keys) {
	return new Promise((resolve) => {
		try {
			const api = getStorageApi();
			const area = api && api.storage ? api.storage[areaName] : null;
			if (!area || typeof area.get !== 'function') {
				resolve({});
				return;
			}
			const maybePromise = area.get(keys, (result) => {
				// Chromium callback style; swallow lastError (managed is
				// unavailable / empty on non-enterprise installs).
				if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
					resolve({});
					return;
				}
				resolve(result || {});
			});
			if (maybePromise && typeof maybePromise.then === 'function') {
				maybePromise.then((result) => resolve(result || {})).catch(() => resolve({}));
			}
		} catch (error) {
			resolve({});
		}
	});
}

// Load enterprise-managed settings into the module cache and return them.
// Presence of a key means it is both forced (value applied) and locked (UI
// disabled). Safe to call repeatedly (e.g. on storage.onChanged for 'managed').
async function loadManagedOverlay() {
	const managed = await readStorageArea('managed', null);
	managedOverlayCache = managed && typeof managed === 'object' ? managed : {};
	managedLockedKeys = new Set(Object.keys(managedOverlayCache));
	return { managed: { ...managedOverlayCache }, lockedKeys: new Set(managedLockedKeys) };
}

// Synchronous accessor for the last-loaded managed overlay.
function getManagedOverlay() {
	return { managed: { ...managedOverlayCache }, lockedKeys: new Set(managedLockedKeys) };
}

// Overlay managed values on top of an already-merged settings object so that
// admin-forced keys always win, regardless of what is stored in sync.
function overlayManaged(settings) {
	return { ...settings, ...managedOverlayCache };
}

// Return a shallow copy with every admin-locked (managed) key removed, so a
// locked key is never persisted to sync from any writer (first-run seed, popup,
// background). managedOverlayReady should have resolved for this to be complete.
function stripLockedKeys(settings) {
	const out = {};
	Object.keys(settings || {}).forEach((key) => {
		if (!managedLockedKeys.has(key)) out[key] = settings[key];
	});
	return out;
}

// Convenience: fully-resolved effective settings (defaults -> sync -> managed).
async function getEffectiveSettings(keys = null) {
	const [sync] = await Promise.all([
		readStorageArea('sync', keys),
		loadManagedOverlay()
	]);
	return { ...DEFAULT_SETTINGS, ...(sync || {}), ...managedOverlayCache };
}

// Kick off the initial managed load immediately. settings.js runs before the
// other content scripts, so the cache is usually warm by the first apply.
const managedOverlayReady = loadManagedOverlay();

initLocalization();
