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
