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
		const titleNode = section.querySelector('ytd-rich-shelf-renderer #title');
		const titleText = (titleNode?.textContent || '').trim().toLowerCase();
		if (titleText === 'most relevant') {
			if (!section.hasAttribute('data-lockedin-hidden')) {
				section.style.display = 'none';
				section.setAttribute('data-lockedin-hidden', hiddenAttr);
			}
		}
	});
}
