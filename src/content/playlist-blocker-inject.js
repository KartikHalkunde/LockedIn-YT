// ===== PLAYLIST AUTO-ADVANCE BLOCKER (MAIN WORLD) =====
// This script runs in the PAGE's main world (not the extension's isolated world).
// It monkey-patches YouTube's player API to block playlist auto-advance
// when the content script signals blocking via a data attribute on <html>.
(function() {
	'use strict';

	var ATTR = 'data-lockedin-block-playlist-autoplay';

	function isBlocking() {
		return document.documentElement.getAttribute(ATTR) === 'true';
	}

	function isPlaylistUrl() {
		return window.location.search.includes('list=');
	}

	// --- Monkey-patch the YouTube player's nextVideo method ---
	var patchApplied = false;

	function patchPlayer() {
		var player = document.getElementById('movie_player');
		if (!player || patchApplied) return;

		// Patch nextVideo()
		if (typeof player.nextVideo === 'function' && !player.__lockedin_nextVideo_original) {
			player.__lockedin_nextVideo_original = player.nextVideo;
			player.nextVideo = function() {
				if (isBlocking() && isPlaylistUrl()) {
					try { player.pauseVideo(); } catch(e) {}
					return;
				}
				return player.__lockedin_nextVideo_original.apply(this, arguments);
			};
		}

		// Patch playVideoAt() — YouTube uses this for playlist index navigation
		if (typeof player.playVideoAt === 'function' && !player.__lockedin_playVideoAt_original) {
			player.__lockedin_playVideoAt_original = player.playVideoAt;
			player.playVideoAt = function(index) {
				if (isBlocking() && isPlaylistUrl()) {
					try { player.pauseVideo(); } catch(e) {}
					return;
				}
				return player.__lockedin_playVideoAt_original.apply(this, arguments);
			};
		}

		patchApplied = true;
	}

	// --- Intercept the ended event in the main world (capture phase) ---
	// Fires BEFORE YouTube's internal handlers
	document.addEventListener('ended', function(event) {
		if (!isBlocking()) return;
		if (!isPlaylistUrl()) return;
		if (!(event.target instanceof HTMLVideoElement)) return;

		// Stop YouTube's playlist queue handlers from receiving this event
		event.stopImmediatePropagation();

		// Pause the video
		event.target.pause();

		// Also pause via the player API
		var player = document.getElementById('movie_player');
		if (player && typeof player.pauseVideo === 'function') {
			try { player.pauseVideo(); } catch(e) {}
		}
	}, true);

	// --- Intercept YouTube's internal yt-navigate events for playlist advancement ---
	document.addEventListener('yt-navigate', function(event) {
		if (!isBlocking()) return;
		if (!isPlaylistUrl()) return;

		// Check if this navigation is a playlist auto-advance
		var detail = event.detail;
		if (detail && detail.endpoint) {
			var cmd = detail.endpoint.watchEndpoint;
			if (cmd && cmd.playlistId) {
				// This is a playlist navigation — block it
				event.stopImmediatePropagation();
				event.preventDefault();

				var player = document.getElementById('movie_player');
				if (player && typeof player.pauseVideo === 'function') {
					try { player.pauseVideo(); } catch(e) {}
				}
			}
		}
	}, true);

	// Patch the player as soon as it's available
	patchPlayer();

	// Re-patch after YouTube's SPA navigation creates a new player
	var mo = new MutationObserver(function() {
		if (!patchApplied || !document.getElementById('movie_player')) {
			patchApplied = false;
		}
		patchPlayer();
	});
	mo.observe(document.documentElement, { childList: true, subtree: true });

	// Also re-patch on SPA navigation events
	window.addEventListener('yt-page-data-updated', function() {
		patchApplied = false;
		patchPlayer();
	});
})();
