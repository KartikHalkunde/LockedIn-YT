// ===== AUTOPLAY MODULE =====

function hideNativeAutoplayToggle(shouldHide) {
	const styleId = 'lockedin-hide-native-autoplay-style';
	const existingStyle = document.getElementById(styleId);

	if (!shouldHide) {
		if (existingStyle) existingStyle.remove();
		return;
	}

	if (existingStyle) return;

	const style = document.createElement('style');
	style.id = styleId;
	style.textContent = `
		.ytp-autonav-toggle-button-container,
		button.ytp-autonav-toggle-button,
		.ytp-autonav-toggle-button,
		.ytp-autonav-toggle-button-bg,
		.ytp-autonav-toggle-tooltip,
		.ytp-next-button,
		.ytp-prev-button,
		.ytp-upnext-autoplay-icon,
		.ytp-autonav-toggle-button-visible,
		.ytp-autonav-toggle-button-cancel,
		.ytm-autonav-bar,
		.ytm-autonav-toggle-button-container,
		.ytm-upnext-autoplay-container,
		.ytp-chrome-bottom [aria-label*="Autoplay" i],
		.ytp-chrome-controls [aria-label*="Autoplay" i],
		.ytp-chrome-bottom [data-tooltip*="Autoplay" i],
		.ytp-chrome-controls [data-tooltip*="Autoplay" i] {
			display: none !important;
			visibility: hidden !important;
			pointer-events: none !important;
		}
	`;

	(document.head || document.documentElement).appendChild(style);
}

let autoplayDisabledThisPage = false;
let autoplayRetryInterval = null;
let autoplayDomObserver = null;
let autoplayPageEventHandler = null;
let autoplayVideoEventHandler = null;
let autoplayTrackedVideos = new Set();

function hideAutoplayUpNextUi(shouldHide) {
	toggleAllElements('.ytp-upnext', shouldHide);
	toggleAllElements('.ytp-upnext-container', shouldHide);
	toggleAllElements('.ytp-autonav-endscreen', shouldHide);
	toggleAllElements('.ytp-autonav-endscreen-upnext-container', shouldHide);
	toggleAllElements('.ytp-next-button', shouldHide);
	toggleAllElements('.ytp-prev-button', shouldHide);
	toggleAllElements('.ytm-autonav-bar', shouldHide);
	toggleAllElements('.ytm-autonav-toggle-button-container', shouldHide);
	toggleAllElements('.ytm-upnext-autoplay-container', shouldHide);
	document.querySelectorAll('.ytp-autonav-endscreen-upnext-button, .ytp-autonav-endscreen-countdown, .ytp-upnext-autoplay-icon').forEach((el) => {
		el.style.display = shouldHide ? 'none' : '';
	});
}

function forcePlayerAutonavOff() {
	const player = document.getElementById('movie_player');
	if (!player) return;

	try {
		if (typeof player.setAutonav === 'function') {
			player.setAutonav(false);
		}
	} catch (_) {}

	try {
		if (typeof player.setAutonavState === 'function') {
			player.setAutonavState('off');
		}
	} catch (_) {}
}

function forcePlayerAutonavOn() {
	const player = document.getElementById('movie_player');
	if (!player) return;

	try {
		if (typeof player.setAutonav === 'function') {
			player.setAutonav(true);
		}
	} catch (_) {}

	try {
		if (typeof player.setAutonavState === 'function') {
			player.setAutonavState('on');
		}
	} catch (_) {}
}

function getAutoplayButtons() {
	return Array.from(document.querySelectorAll(
		'button[data-tooltip-target-id="ytp-autonav-toggle-button"], ' +
		'button.ytp-autonav-toggle-button, ' +
		'.ytp-autonav-toggle-button-container button, ' +
		'.ytm-autonav-toggle-button-container button'
	));
}

function isAutoplayButtonOn(button) {
	if (!button) return false;
	const stateNode = button.querySelector('[aria-checked]') || button;
	const ariaChecked = stateNode.getAttribute('aria-checked');
	if (ariaChecked === 'true') return true;
	if (ariaChecked === 'false') return false;

	const ariaPressed = button.getAttribute('aria-pressed');
	if (ariaPressed === 'true') return true;
	if (ariaPressed === 'false') return false;

	return button.classList.contains('ytp-autonav-toggle-button-active');
}

function paintAutoplayButtonOff(button) {
	if (!button) return;
	const stateNode = button.querySelector('[aria-checked]') || button;
	stateNode.setAttribute('aria-checked', 'false');
	button.setAttribute('aria-pressed', 'false');
	button.classList.remove('ytp-autonav-toggle-button-active', 'ytp-autonav-toggle-button-visible');
	button.classList.add('ytp-autonav-toggle-button-cancel');
}

function paintAutoplayButtonOn(button) {
	if (!button) return;
	const stateNode = button.querySelector('[aria-checked]') || button;
	stateNode.setAttribute('aria-checked', 'true');
	button.setAttribute('aria-pressed', 'true');
	button.classList.remove('ytp-autonav-toggle-button-cancel');
	button.classList.add('ytp-autonav-toggle-button-active');
}

function enforceAutoplayOn() {
	forcePlayerAutonavOn();

	const buttons = getAutoplayButtons();
	buttons.forEach((button) => {
		if (button.hasAttribute('data-lockedin-autoplay-bound')) {
			button.removeEventListener('click', onNativeAutoplayButtonClick);
			button.removeAttribute('data-lockedin-autoplay-bound');
		}

		if (!isAutoplayButtonOn(button)) {
			button.click();
		}

		paintAutoplayButtonOn(button);
	});

	hideAutoplayUpNextUi(false);
}

function onAutoplayPageChange() {
	if (latestSyncedSettings.extensionEnabled === false) return;
	if (!latestSyncedSettings.disableAutoplay) return;
	enforceAutoplayOff();
}

function onNativeAutoplayButtonClick() {
	setTimeout(() => {
		if (latestSyncedSettings.extensionEnabled === false) return;
		if (!latestSyncedSettings.disableAutoplay) return;
		enforceAutoplayOff();
	}, 0);
}

function enforceAutoplayOff() {
	forcePlayerAutonavOff();

	const buttons = getAutoplayButtons();
	buttons.forEach((button) => {
		if (!button.hasAttribute('data-lockedin-autoplay-bound')) {
			button.addEventListener('click', onNativeAutoplayButtonClick);
			button.setAttribute('data-lockedin-autoplay-bound', 'true');
		}

		if (isAutoplayButtonOn(button)) {
			if (!autoplayDisabledThisPage) {
				trackStat('autoplay', 1);
				autoplayDisabledThisPage = true;
			}
			button.click();
		}

		paintAutoplayButtonOff(button);
	});

	hideAutoplayUpNextUi(true);
}

function addAutoplayVideoNode(video) {
	if (!video || autoplayTrackedVideos.has(video) || !autoplayVideoEventHandler) return;
	autoplayTrackedVideos.add(video);
	['play', 'progress', 'ended'].forEach((eventName) => {
		video.addEventListener(eventName, autoplayVideoEventHandler);
	});
}

function removeAutoplayVideoNode(video) {
	if (!video || !autoplayTrackedVideos.has(video) || !autoplayVideoEventHandler) return;
	['play', 'progress', 'ended'].forEach((eventName) => {
		video.removeEventListener(eventName, autoplayVideoEventHandler);
	});
	autoplayTrackedVideos.delete(video);
}

function stopAutoplayEnforcement() {
	if (autoplayDomObserver) {
		autoplayDomObserver.disconnect();
		autoplayDomObserver = null;
	}

	if (autoplayPageEventHandler) {
		window.removeEventListener('load', autoplayPageEventHandler, true);
		window.removeEventListener('yt-page-data-updated', autoplayPageEventHandler, true);
		window.removeEventListener('state-navigateend', autoplayPageEventHandler, true);
		document.removeEventListener('yt-page-data-updated', autoplayPageEventHandler, true);
		document.removeEventListener('state-navigateend', autoplayPageEventHandler, true);
		autoplayPageEventHandler = null;
	}

	Array.from(autoplayTrackedVideos).forEach((video) => removeAutoplayVideoNode(video));
	autoplayTrackedVideos.clear();
	autoplayVideoEventHandler = null;

	getAutoplayButtons().forEach((button) => {
		if (button.hasAttribute('data-lockedin-autoplay-bound')) {
			button.removeEventListener('click', onNativeAutoplayButtonClick);
			button.removeAttribute('data-lockedin-autoplay-bound');
		}
	});
}

function startAutoplayEnforcement() {
	if (!autoplayPageEventHandler) {
		autoplayPageEventHandler = onAutoplayPageChange;
		window.addEventListener('load', autoplayPageEventHandler, true);
		window.addEventListener('yt-page-data-updated', autoplayPageEventHandler, true);
		window.addEventListener('state-navigateend', autoplayPageEventHandler, true);
		document.addEventListener('yt-page-data-updated', autoplayPageEventHandler, true);
		document.addEventListener('state-navigateend', autoplayPageEventHandler, true);
	}

	if (!autoplayDomObserver) {
		autoplayDomObserver = new MutationObserver(() => {
			onAutoplayPageChange();
		});
		autoplayDomObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
	}

	if (latestSyncedSettings.extensionEnabled !== false && latestSyncedSettings.disableAutoplay) {
		enforceAutoplayOff();
	}
}

function disableAutoplay(shouldDisable) {
	if (!shouldDisable) {
		stopAutoplayEnforcement();
		hideNativeAutoplayToggle(false);
		enforceAutoplayOn();
		setTimeout(enforceAutoplayOn, 200);
		setTimeout(enforceAutoplayOn, 700);
		autoplayDisabledThisPage = false;
		return;
	}

	hideNativeAutoplayToggle(true);
	hideAutoplayUpNextUi(true);
	startAutoplayEnforcement();
	enforceAutoplayOff();
	setTimeout(enforceAutoplayOff, 250);
	setTimeout(enforceAutoplayOff, 800);
	setTimeout(enforceAutoplayOff, 1800);
}
