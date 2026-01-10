// ===== CROSS-BROWSER COMPATIBILITY =====
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  hideFeed: false,
  redirectToSubs: false,
  hideShortsHomepage: false,
  hideCommunityPosts: false,
  hideShortsGlobally: false,
  redirectShorts: false,
  hideSidebar: false,
  hideRecommended: false,
  hideSidebarShorts: false,
  hideLiveChat: false,
  hideEndCards: false,
  hideComments: false,
  disableAutoplay: false,
  hideSearchRecommended: false,
  hideShortsSearch: false,
  hideExplore: false,
  hideMoreFromYT: false,
  hidePlaylists: false,
  hideSubscriptions: false,
  extensionEnabled: true,
  lightMode: false,
  showStats: false,
  takeBreak: false,
  breakDuration: 5,
  customMeme: null,
  appearance: 'auto',
  language: 'auto'
};

// Default stats structure
const DEFAULT_STATS = {
  shortsBlocked: 0,
  recsHidden: 0,
  endCardsBlocked: 0,
  autoplayStops: 0,
  sessionTimeMs: 0,
  todaySessionMs: 0,
  todayDate: null,
  weekTimeSaved: 0,
  weekStartDate: null,
  firstUseDate: null
};

// Time saved estimates (in minutes)
const TIME_SAVED_ESTIMATES = {
  short: 0.5,
  recommendation: 5,
  endCard: 3,
  autoplay: 8
};

const APPEARANCE_OPTIONS = ['auto', 'light', 'dark'];
const APPEARANCE_LABEL_KEYS = {
  auto: 'appearance.option.auto',
  light: 'appearance.option.light',
  dark: 'appearance.option.dark'
};

const LANGUAGE_LABELS = {
  auto: { labelKey: 'language.option.auto', fallback: 'Auto' },
  en: { label: 'English' },
  es: { label: 'Español' },
  hi: { label: 'हिन्दी' },
  pt: { label: 'Português' },
  fr: { label: 'Français' },
  de: { label: 'Deutsch' }
};

const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_LABELS);
const SUPPORTED_LANGUAGES = ['en', 'es', 'hi', 'pt', 'fr', 'de'];
const FALLBACK_LANGUAGE = 'en';

const I18N_STRINGS = {
  en: {
    'tooltip.menu': 'Menu',
    'tooltip.power': 'Toggle Extension',
    'tooltip.close': 'Close',
    'power.instant': 'Turn Off Now',
    'power.ten': 'Turn Off for 10 min',
    'power.twenty': 'Turn Off for 20 min',
    'power.thirty': 'Turn Off for 30 min',
    'menu.title': 'Menu',
    'stats.minSaved': 'Min Saved',
    'stats.timeSaved': 'Time Saved',
    'stats.shortsAvoided': 'Shorts Avoided',
    'stats.daysFocused': 'Days Focused',
    'stats.hoursSuffix': 'hr',
    'menu.option.showStats': 'Show Stats',
    'menu.option.appearance': 'Extension Appearance',
    'menu.option.language': 'Extension Language',
    'appearance.option.auto': 'Auto',
    'appearance.option.light': 'Light',
    'appearance.option.dark': 'Dark',
    'language.option.auto': 'Auto',
    'group.homepage': 'Homepage',
    'setting.hideFeed': 'Hide Homepage Feed',
    'setting.redirectToSubs': 'Redirect to Subscriptions',
    'setting.hideShortsHomepage': 'Hide YouTube Shorts',
    'setting.hideCommunityPosts': 'Hide Community Posts',
    'group.shorts': 'YouTube Shorts',
    'setting.hideShortsGlobal': 'Hide Shorts (All Pages)',
    'setting.redirectShorts': 'Redirect Shorts',
    'group.video': 'Video Page',
    'setting.hideSidebar': 'Hide Video Sidebar',
    'setting.hideRecommended': 'Hide Recommended Videos',
    'setting.hideSidebarShorts': 'Hide YouTube Shorts',
    'setting.hidePlaylists': 'Hide Playlists',
    'setting.hideSubscriptions': 'Hide Subscriptions',
    'setting.hideEndCards': 'Hide End Screen Cards',
    'setting.hideComments': 'Hide Comments',
    'setting.hideLiveChat': 'Hide Live Chat',
    'setting.disableAutoplay': 'Disable Autoplay',
    'group.search': 'Search Results',
    'setting.hideShortsSearch': 'Hide YouTube Shorts',
    'group.sidebar': 'YouTube Sidebar',
    'setting.hideExplore': 'Hide Explore & Trending',
    'setting.hideMoreFromYT': 'Hide More From YouTube',
    'state.lockedinOff': 'LockedIn is off',
    'state.breakTimerPrefix': 'See you in',
    'sponsor.title': 'Support LockedIn',
    'sponsor.body': `Donate via <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> or <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a> to support my work.`,
    'sponsor.bodySecondary': `If you can't contribute financially, I would appreciate if you could share LockedIn with friends or leave a review on <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>or <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a>.`,
    'feedback.title': 'Feedback',
    'feedback.requestHeading': 'Request a Feature',
    'feedback.requestText': `Have an idea to make LockedIn even better? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">Request it here.</a>`,
    'feedback.bugHeading': 'Found a Bug?',
    'feedback.bugText': `YouTube constantly keeps updating the layout. If you found a bug, <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">report it here.</a>`,
    'footer.sponsor': 'Sponsor',
    'footer.feedback': 'Feedback',
    'customMeme.tooLarge': 'File "{filename}" is too large! Maximum size is 500KB per image.',
    'customMeme.invalidType': 'File "{filename}" has an invalid type! Use PNG, JPG, GIF, or WebP.',
    'customMeme.maxImages': 'Maximum 5 images allowed! You already have {existing} and tried to add {added}.',
    'customMeme.unableUpdate': 'Unable to update custom images. Please try again.',
    'customMeme.unableSave': 'Unable to save these images. Please try again.'
  },
  es: {
    'tooltip.menu': 'Menú',
    'tooltip.power': 'Activar o desactivar',
    'tooltip.close': 'Cerrar',
    'power.instant': 'Desactivar ahora',
    'power.ten': 'Desactivar por 10 min',
    'power.twenty': 'Desactivar por 20 min',
    'power.thirty': 'Desactivar por 30 min',
    'menu.title': 'Menú',
    'stats.minSaved': 'Min ahorrados',
    'stats.timeSaved': 'Tiempo ahorrado',
    'stats.shortsAvoided': 'Shorts evitados',
    'stats.daysFocused': 'Días enfocado',
    'stats.hoursSuffix': 'h',
    'menu.option.showStats': 'Mostrar estadísticas',
    'menu.option.appearance': 'Apariencia de la extensión',
    'menu.option.language': 'Idioma de la extensión',
    'appearance.option.auto': 'Automático',
    'appearance.option.light': 'Claro',
    'appearance.option.dark': 'Oscuro',
    'language.option.auto': 'Automático',
    'group.homepage': 'Página principal',
    'setting.hideFeed': 'Ocultar feed de inicio',
    'setting.redirectToSubs': 'Redirigir a Suscripciones',
    'setting.hideShortsHomepage': 'Ocultar Shorts de YouTube',
    'setting.hideCommunityPosts': 'Ocultar publicaciones de la comunidad',
    'group.shorts': 'YouTube Shorts',
    'setting.hideShortsGlobal': 'Ocultar Shorts (todas las páginas)',
    'setting.redirectShorts': 'Redirigir Shorts',
    'group.video': 'Página de video',
    'setting.hideSidebar': 'Ocultar barra lateral del video',
    'setting.hideRecommended': 'Ocultar videos recomendados',
    'setting.hideSidebarShorts': 'Ocultar Shorts de YouTube',
    'setting.hidePlaylists': 'Ocultar listas de reproducción',
    'setting.hideSubscriptions': 'Ocultar suscripciones',
    'setting.hideEndCards': 'Ocultar pantallas finales',
    'setting.hideComments': 'Ocultar comentarios',
    'setting.hideLiveChat': 'Ocultar chat en vivo',
    'setting.disableAutoplay': 'Desactivar reproducción automática',
    'group.search': 'Resultados de búsqueda',
    'setting.hideShortsSearch': 'Ocultar Shorts de YouTube',
    'group.sidebar': 'Barra lateral de YouTube',
    'setting.hideExplore': 'Ocultar Explorar y Tendencias',
    'setting.hideMoreFromYT': 'Ocultar Más de YouTube',
    'state.lockedinOff': 'LockedIn está desactivado',
    'state.breakTimerPrefix': 'Te veo en',
    'sponsor.title': 'Apoya LockedIn',
    'sponsor.body': `Dona vía <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> o <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a> para apoyar mi trabajo.`,
    'sponsor.bodySecondary': `Si no puedes contribuir económicamente, agradecería que compartieras LockedIn con amigos o dejaras una reseña en <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>o <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a>.`,
    'feedback.title': 'Comentarios',
    'feedback.requestHeading': 'Solicita una función',
    'feedback.requestText': `¿Tienes una idea para mejorar LockedIn? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">Pídela aquí.</a>`,
    'feedback.bugHeading': '¿Encontraste un error?',
    'feedback.bugText': `YouTube cambia el diseño constantemente. Si encontraste un error, <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">repórtalo aquí.</a>`,
    'footer.sponsor': 'Patrocinar',
    'footer.feedback': 'Comentarios',
    'customMeme.tooLarge': 'El archivo "{filename}" es demasiado grande. El máximo es 500 KB por imagen.',
    'customMeme.invalidType': 'El archivo "{filename}" tiene un tipo no válido. Usa PNG, JPG, GIF o WebP.',
    'customMeme.maxImages': 'Solo se permiten 5 imágenes. Ya tienes {existing} e intentaste agregar {added}.',
    'customMeme.unableUpdate': 'No se pudieron actualizar las imágenes personalizadas. Inténtalo de nuevo.',
    'customMeme.unableSave': 'No se pudieron guardar estas imágenes. Inténtalo de nuevo.'
  },
  hi: {
    'tooltip.menu': 'मेन्यू',
    'tooltip.power': 'एक्सटेंशन चालू/बंद करें',
    'tooltip.close': 'बंद करें',
    'power.instant': 'अभी बंद करें',
    'power.ten': '10 मिनट के लिए बंद करें',
    'power.twenty': '20 मिनट के लिए बंद करें',
    'power.thirty': '30 मिनट के लिए बंद करें',
    'menu.title': 'मेन्यू',
    'stats.minSaved': 'बचाए गए मिनट',
    'stats.timeSaved': 'बचाया गया समय',
    'stats.shortsAvoided': 'टाले गए शॉर्ट्स',
    'stats.daysFocused': 'फ़ोकस किए दिन',
    'stats.hoursSuffix': 'घं',
    'menu.option.showStats': 'आँकड़े दिखाएँ',
    'menu.option.appearance': 'एक्सटेंशन की रूपरेखा',
    'menu.option.language': 'एक्सटेंशन की भाषा',
    'appearance.option.auto': 'स्वचालित',
    'appearance.option.light': 'हल्का',
    'appearance.option.dark': 'गहरा',
    'language.option.auto': 'स्वचालित',
    'group.homepage': 'होमपेज',
    'setting.hideFeed': 'होमपेज फ़ीड छुपाएँ',
    'setting.redirectToSubs': 'सब्सक्रिप्शन पर ले जाएँ',
    'setting.hideShortsHomepage': 'YouTube शॉर्ट्स छुपाएँ',
    'setting.hideCommunityPosts': 'कम्युनिटी पोस्ट छुपाएँ',
    'group.shorts': 'YouTube शॉर्ट्स',
    'setting.hideShortsGlobal': 'शॉर्ट्स छुपाएँ (सभी पेज)',
    'setting.redirectShorts': 'शॉर्ट्स को रीडायरेक्ट करें',
    'group.video': 'वीडियो पेज',
    'setting.hideSidebar': 'वीडियो साइडबार छुपाएँ',
    'setting.hideRecommended': 'अनुशंसित वीडियो छुपाएँ',
    'setting.hideSidebarShorts': 'YouTube शॉर्ट्स छुपाएँ',
    'setting.hidePlaylists': 'प्लेलिस्ट छुपाएँ',
    'setting.hideSubscriptions': 'सदस्यताएँ छुपाएँ',
    'setting.hideEndCards': 'एंड स्क्रीन कार्ड छुपाएँ',
    'setting.hideComments': 'कमेंट्स छुपाएँ',
    'setting.hideLiveChat': 'लाइव चैट छुपाएँ',
    'setting.disableAutoplay': 'ऑटोप्ले बंद करें',
    'group.search': 'खोज परिणाम',
    'setting.hideShortsSearch': 'YouTube शॉर्ट्स छुपाएँ',
    'group.sidebar': 'YouTube साइडबार',
    'setting.hideExplore': 'एक्सप्लोर और ट्रेंडिंग छुपाएँ',
    'setting.hideMoreFromYT': 'More From YouTube छुपाएँ',
    'state.lockedinOff': 'LockedIn बंद है',
    'state.breakTimerPrefix': 'मिलते हैं',
    'sponsor.title': 'LockedIn को सपोर्ट करें',
    'sponsor.body': `मेरे काम को सपोर्ट करने के लिए <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> या <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a> पर दान करें।`,
    'sponsor.bodySecondary': `अगर आप आर्थिक रूप से मदद नहीं कर सकते, तो LockedIn को दोस्तों के साथ साझा करें या <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>या <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a> पर समीक्षा छोड़ें।`,
    'feedback.title': 'फ़ीडबैक',
    'feedback.requestHeading': 'फ़ीचर का अनुरोध करें',
    'feedback.requestText': `LockedIn को बेहतर बनाने का कोई विचार है? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">यहाँ अनुरोध करें।</a>`,
    'feedback.bugHeading': 'बग मिला?',
    'feedback.bugText': `YouTube लगातार लेआउट बदलता रहता है। अगर कोई बग मिला है तो <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">यहाँ रिपोर्ट करें।</a>`,
    'footer.sponsor': 'सपोर्ट',
    'footer.feedback': 'फ़ीडबैक',
    'customMeme.tooLarge': 'फ़ाइल "{filename}" बहुत बड़ी है। प्रत्येक छवि के लिए अधिकतम 500KB की अनुमति है।',
    'customMeme.invalidType': 'फ़ाइल "{filename}" का प्रकार मान्य नहीं है। PNG, JPG, GIF या WebP का उपयोग करें।',
    'customMeme.maxImages': 'अधिकतम 5 छवियाँ अनुमत हैं। आपके पास पहले से {existing} हैं और आपने {added} जोड़ने की कोशिश की।',
    'customMeme.unableUpdate': 'कस्टम छवियाँ अपडेट नहीं हो सकीं। कृपया दोबारा प्रयास करें।',
    'customMeme.unableSave': 'इन छवियों को सहेजा नहीं जा सका। कृपया दोबारा प्रयास करें।'
  },
  pt: {
    'tooltip.menu': 'Menu',
    'tooltip.power': 'Ativar/desativar',
    'tooltip.close': 'Fechar',
    'power.instant': 'Desativar agora',
    'power.ten': 'Ativar por 10 min',
    'power.twenty': 'Ativar por 20 min',
    'power.thirty': 'Ativar por 30 min',
    'menu.title': 'Menu',
    'stats.minSaved': 'Min economizados',
    'stats.timeSaved': 'Tempo economizado',
    'stats.shortsAvoided': 'Shorts evitados',
    'stats.daysFocused': 'Dias focado',
    'stats.hoursSuffix': 'h',
    'menu.option.showStats': 'Mostrar estatísticas',
    'menu.option.appearance': 'Aparência da extensão',
    'menu.option.language': 'Idioma da extensão',
    'appearance.option.auto': 'Automático',
    'appearance.option.light': 'Claro',
    'appearance.option.dark': 'Escuro',
    'language.option.auto': 'Automático',
    'group.homepage': 'Página inicial',
    'setting.hideFeed': 'Ocultar feed inicial',
    'setting.redirectToSubs': 'Redirecionar para Inscrições',
    'setting.hideShortsHomepage': 'Ocultar Shorts do YouTube',
    'setting.hideCommunityPosts': 'Ocultar postagens da comunidade',
    'group.shorts': 'YouTube Shorts',
    'setting.hideShortsGlobal': 'Ocultar Shorts (todas as páginas)',
    'setting.redirectShorts': 'Redirecionar Shorts',
    'group.video': 'Página de vídeo',
    'setting.hideSidebar': 'Ocultar barra lateral do vídeo',
    'setting.hideRecommended': 'Ocultar vídeos recomendados',
    'setting.hideSidebarShorts': 'Ocultar Shorts do YouTube',
    'setting.hidePlaylists': 'Ocultar playlists',
    'setting.hideSubscriptions': 'Ocultar inscrições',
    'setting.hideEndCards': 'Ocultar telas finais',
    'setting.hideComments': 'Ocultar comentários',
    'setting.hideLiveChat': 'Ocultar chat ao vivo',
    'setting.disableAutoplay': 'Desativar reprodução automática',
    'group.search': 'Resultados de pesquisa',
    'setting.hideShortsSearch': 'Ocultar Shorts do YouTube',
    'group.sidebar': 'Barra lateral do YouTube',
    'setting.hideExplore': 'Ocultar Explorar e Em alta',
    'setting.hideMoreFromYT': 'Ocultar Mais do YouTube',
    'state.lockedinOff': 'LockedIn está desativado',
    'state.breakTimerPrefix': 'Vejo você em',
    'sponsor.title': 'Apoie o LockedIn',
    'sponsor.body': `Doe via <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> ou <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a> para apoiar meu trabalho.`,
    'sponsor.bodySecondary': `Se não puder contribuir financeiramente, compartilhe o LockedIn com amigos ou deixe uma avaliação no <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>ou no <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a>.`,
    'feedback.title': 'Feedback',
    'feedback.requestHeading': 'Solicite um recurso',
    'feedback.requestText': `Tem uma ideia para deixar o LockedIn ainda melhor? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">Peça aqui.</a>`,
    'feedback.bugHeading': 'Encontrou um erro?',
    'feedback.bugText': `O YouTube atualiza o layout o tempo todo. Se encontrou um bug, <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">relate aqui.</a>`,
    'footer.sponsor': 'Patrocinar',
    'footer.feedback': 'Feedback',
    'customMeme.tooLarge': 'O arquivo "{filename}" é muito grande. O máximo é 500 KB por imagem.',
    'customMeme.invalidType': 'O arquivo "{filename}" tem um formato inválido. Use PNG, JPG, GIF ou WebP.',
    'customMeme.maxImages': 'São permitidas no máximo 5 imagens. Você já tem {existing} e tentou adicionar {added}.',
    'customMeme.unableUpdate': 'Não foi possível atualizar as imagens personalizadas. Tente novamente.',
    'customMeme.unableSave': 'Não foi possível salvar essas imagens. Tente novamente.'
  },
  fr: {
    'tooltip.menu': 'Menu',
    'tooltip.power': "Activer/désactiver",
    'tooltip.close': 'Fermer',
    'power.instant': 'Désactiver maintenant',
    'power.ten': 'Désactiver pendant 10 min',
    'power.twenty': 'Désactiver pendant 20 min',
    'power.thirty': 'Désactiver pendant 30 min',
    'menu.title': 'Menu',
    'stats.minSaved': 'Minutes gagnées',
    'stats.timeSaved': 'Temps gagné',
    'stats.shortsAvoided': 'Shorts évités',
    'stats.daysFocused': 'Jours concentré',
    'stats.hoursSuffix': 'h',
    'menu.option.showStats': 'Afficher les statistiques',
    'menu.option.appearance': "Apparence de l’extension",
    'menu.option.language': "Langue de l’extension",
    'appearance.option.auto': 'Automatique',
    'appearance.option.light': 'Clair',
    'appearance.option.dark': 'Sombre',
    'language.option.auto': 'Automatique',
    'group.homepage': 'Page d’accueil',
    'setting.hideFeed': 'Masquer le flux d’accueil',
    'setting.redirectToSubs': 'Rediriger vers Abonnements',
    'setting.hideShortsHomepage': 'Masquer les YouTube Shorts',
    'setting.hideCommunityPosts': 'Masquer les publications de la communauté',
    'group.shorts': 'YouTube Shorts',
    'setting.hideShortsGlobal': 'Masquer Shorts (toutes les pages)',
    'setting.redirectShorts': 'Rediriger les Shorts',
    'group.video': 'Page vidéo',
    'setting.hideSidebar': 'Masquer la barre latérale',
    'setting.hideRecommended': 'Masquer les vidéos recommandées',
    'setting.hideSidebarShorts': 'Masquer les YouTube Shorts',
    'setting.hidePlaylists': 'Masquer les playlists',
    'setting.hideSubscriptions': 'Masquer les abonnements',
    'setting.hideEndCards': 'Masquer les écrans de fin',
    'setting.hideComments': 'Masquer les commentaires',
    'setting.hideLiveChat': 'Masquer le chat en direct',
    'setting.disableAutoplay': 'Désactiver la lecture auto',
    'group.search': 'Résultats de recherche',
    'setting.hideShortsSearch': 'Masquer les YouTube Shorts',
    'group.sidebar': 'Barre latérale YouTube',
    'setting.hideExplore': 'Masquer Explorer et Tendances',
    'setting.hideMoreFromYT': 'Masquer Plus de YouTube',
    'state.lockedinOff': 'LockedIn est désactivé',
    'state.breakTimerPrefix': 'À bientôt dans',
    'sponsor.title': 'Soutenir LockedIn',
    'sponsor.body': `Faites un don via <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> ou <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a> pour soutenir mon travail.`,
    'sponsor.bodySecondary': `Si vous ne pouvez pas contribuer financièrement, merci de partager LockedIn avec vos amis ou de laisser un avis sur <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>ou <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a>.`,
    'feedback.title': 'Retour',
    'feedback.requestHeading': 'Demander une fonctionnalité',
    'feedback.requestText': `Une idée pour améliorer LockedIn ? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">Demandez-la ici.</a>`,
    'feedback.bugHeading': 'Vous avez trouvé un bug ?',
    'feedback.bugText': `YouTube modifie sans cesse son interface. Si vous trouvez un bug, <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">signalez-le ici.</a>`,
    'footer.sponsor': 'Soutenir',
    'footer.feedback': 'Retour',
    'customMeme.tooLarge': 'Le fichier "{filename}" est trop volumineux. Taille maximale : 500 Ko par image.',
    'customMeme.invalidType': 'Le fichier "{filename}" a un format non valide. Utilisez PNG, JPG, GIF ou WebP.',
    'customMeme.maxImages': 'Maximum 5 images autorisées. Vous en avez déjà {existing} et avez tenté d’en ajouter {added}.',
    'customMeme.unableUpdate': 'Impossible de mettre à jour les images personnalisées. Réessayez.',
    'customMeme.unableSave': 'Impossible d’enregistrer ces images. Réessayez.'
  },
  de: {
    'tooltip.menu': 'Menü',
    'tooltip.power': 'Erweiterung umschalten',
    'tooltip.close': 'Schließen',
    'power.instant': 'Jetzt deaktivieren',
    'power.ten': 'Für 10 Min deaktivieren',
    'power.twenty': 'Für 20 Min deaktivieren',
    'power.thirty': 'Für 30 Min deaktivieren',
    'menu.title': 'Menü',
    'stats.minSaved': 'Minuten gespart',
    'stats.timeSaved': 'Zeit gespart',
    'stats.shortsAvoided': 'Shorts vermieden',
    'stats.daysFocused': 'Tage fokussiert',
    'stats.hoursSuffix': 'Std',
    'menu.option.showStats': 'Statistiken anzeigen',
    'menu.option.appearance': 'Aussehen der Erweiterung',
    'menu.option.language': 'Sprache der Erweiterung',
    'appearance.option.auto': 'Automatisch',
    'appearance.option.light': 'Hell',
    'appearance.option.dark': 'Dunkel',
    'language.option.auto': 'Automatisch',
    'group.homepage': 'Startseite',
    'setting.hideFeed': 'Startseiten-Feed ausblenden',
    'setting.redirectToSubs': 'Zu Abos umleiten',
    'setting.hideShortsHomepage': 'YouTube Shorts ausblenden',
    'setting.hideCommunityPosts': 'Community-Beiträge ausblenden',
    'group.shorts': 'YouTube Shorts',
    'setting.hideShortsGlobal': 'Shorts ausblenden (alle Seiten)',
    'setting.redirectShorts': 'Shorts umleiten',
    'group.video': 'Videoseite',
    'setting.hideSidebar': 'Videoseitenleiste ausblenden',
    'setting.hideRecommended': 'Empfohlene Videos ausblenden',
    'setting.hideSidebarShorts': 'YouTube Shorts ausblenden',
    'setting.hidePlaylists': 'Playlists ausblenden',
    'setting.hideSubscriptions': 'Abonnements ausblenden',
    'setting.hideEndCards': 'Endkarten ausblenden',
    'setting.hideComments': 'Kommentare ausblenden',
    'setting.hideLiveChat': 'Livechat ausblenden',
    'setting.disableAutoplay': 'Autoplay deaktivieren',
    'group.search': 'Suchergebnisse',
    'setting.hideShortsSearch': 'YouTube Shorts ausblenden',
    'group.sidebar': 'YouTube-Seitenleiste',
    'setting.hideExplore': 'Explore & Trends ausblenden',
    'setting.hideMoreFromYT': 'Mehr von YouTube ausblenden',
    'state.lockedinOff': 'LockedIn ist deaktiviert',
    'state.breakTimerPrefix': 'Bis gleich in',
    'sponsor.title': 'LockedIn unterstützen',
    'sponsor.body': `Spende über <a href="https://github.com/sponsors/KartikHalkunde" target="_blank" class="sponsor-link">GitHub Sponsors<svg class="heart-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"/></svg></a> oder <a href="https://kartikhalkunde.github.io/LockedIn-YT/upi.html" target="_blank" class="sponsor-link">UPI</a>, um meine Arbeit zu unterstützen.`,
    'sponsor.bodySecondary': `Wenn du finanziell nicht helfen kannst, teile LockedIn mit Freunden oder hinterlasse eine Bewertung im <a href="https://addons.mozilla.org/en-US/firefox/addon/lockedin-yt/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search" target="_blank" class="sponsor-link">Firefox</a><br>oder im <a href="https://microsoftedge.microsoft.com/addons/detail/lockedin/hibjbjgfbmhpiaapeccnfddnpabnlklj" target="_blank" class="sponsor-link">MS Edge</a>-Store.`,
    'feedback.title': 'Feedback',
    'feedback.requestHeading': 'Funktion anfragen',
    'feedback.requestText': `Hast du eine Idee, um LockedIn zu verbessern? <a href="https://forms.gle/sPsfwB6C16Yx299f9" target="_blank" class="feedback-link-red">Fordere sie hier an.</a>`,
    'feedback.bugHeading': 'Fehler gefunden?',
    'feedback.bugText': `YouTube ändert ständig das Layout. Wenn du einen Fehler gefunden hast, <a href="https://forms.gle/9zPoc7yQpDcKD4kP9" target="_blank" class="feedback-link-red">melde ihn hier.</a>`,
    'footer.sponsor': 'Unterstützen',
    'footer.feedback': 'Feedback',
    'customMeme.tooLarge': 'Die Datei "{filename}" ist zu groß. Maximal 500 KB pro Bild.',
    'customMeme.invalidType': 'Die Datei "{filename}" hat ein ungültiges Format. Verwende PNG, JPG, GIF oder WebP.',
    'customMeme.maxImages': 'Es sind höchstens 5 Bilder erlaubt. Du hast bereits {existing} und wolltest {added} hinzufügen.',
    'customMeme.unableUpdate': 'Benutzerdefinierte Bilder konnten nicht aktualisiert werden. Bitte erneut versuchen.',
    'customMeme.unableSave': 'Diese Bilder konnten nicht gespeichert werden. Bitte erneut versuchen.'
  }
};

let activeLanguage = FALLBACK_LANGUAGE;
let currentAppearanceValue = 'auto';
let currentLanguagePreference = 'auto';

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

function applyTranslations(languageCode) {
  const normalized = SUPPORTED_LANGUAGES.includes(languageCode) ? languageCode : FALLBACK_LANGUAGE;
  activeLanguage = normalized;
  document.documentElement.setAttribute('lang', normalized);
  
  const elements = document.querySelectorAll('[data-i18n-key]');
  elements.forEach((el) => {
    const key = el.dataset.i18nKey;
    if (!key) return;
    
    const attr = el.dataset.i18nAttr;
    const type = el.dataset.i18nType;
    const value = translate(key, null, normalized);
    if (!value) return;

    if (attr) {
      el.setAttribute(attr, value);
    } else if (type === 'html') {
      // 1. Clear existing content
      el.textContent = '';
      
      // 2. Use DOMParser to parse the string into a temporary document
      // This avoids using the forbidden ".innerHTML" property entirely
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      
      // 3. Move the parsed nodes into your element
      const nodes = Array.from(doc.body.childNodes);
      nodes.forEach(node => {
        // Clone the node to move it from the temporary doc to the popup
        el.appendChild(document.importNode(node, true));
      });
    } else {
      el.textContent = value;
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupToggleListeners();
  setupPowerButton();
  setupMenuButton();
  setupFeedbackButton();
  setupSponsorButton();
  setupCustomMemeUpload();
  setupBreakTimer();
  displayVersion();
  loadStats();
  updateHeaderVisibility();
});

// ===== VERSION DISPLAY =====
function displayVersion() {
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `v.1.0.96`;
    versionElement.setAttribute('aria-label', `Version 1.0.96`);
  }
}

// ===== MENU BUTTON (Hamburger) =====
function setupMenuButton() {
  const menuButton = document.getElementById('menuButton');
  const closeMenuButton = document.getElementById('closeMenuButton');
  const settingsMenu = document.getElementById('settingsMenu');

  menuButton.addEventListener('click', () => {
    const isOpen = settingsMenu.classList.contains('open');
    if (isOpen) {
      settingsMenu.classList.remove('open');
      menuButton.classList.remove('open');
      closeMenuInlineDropdowns();
    } else {
      closePowerDropdown();
      closeMenuInlineDropdowns();
      settingsMenu.classList.add('open');
      menuButton.classList.add('open');
      triggerStatsAnimation();
    }
    updateHeaderVisibility();
  });

  closeMenuButton.addEventListener('click', () => {
    settingsMenu.classList.remove('open');
    menuButton.classList.remove('open');
    closeMenuInlineDropdowns();
    updateHeaderVisibility();
  });
}

// Trigger stats counter animation
function triggerStatsAnimation() {
  const statsSection = document.getElementById('statsSection');
  if (statsSection && statsSection.classList.contains('visible')) {
    browser.storage.local.get('stats', (result) => {
      const stats = { ...DEFAULT_STATS, ...result.stats };
      updateStatsDisplay(stats, true);
    });
  }
}

// ===== FEEDBACK BUTTON =====
function setupFeedbackButton() {
  const feedbackButton = document.getElementById('feedbackButton');
  const closeFeedbackButton = document.getElementById('closeFeedbackButton');
  const feedbackPage = document.getElementById('feedbackPage');

  if (feedbackButton && feedbackPage) {
    feedbackButton.addEventListener('click', () => {
      closePowerDropdown();
      feedbackPage.classList.add('open');
      updateHeaderVisibility();
    });
  }

  if (closeFeedbackButton && feedbackPage) {
    closeFeedbackButton.addEventListener('click', () => {
      feedbackPage.classList.remove('open');
      updateHeaderVisibility();
    });
  }
}

// ===== SPONSOR BUTTON =====
function setupSponsorButton() {
  const sponsorButton = document.getElementById('sponsorButton');
  const closeSponsorButton = document.getElementById('closeSponsorButton');
  const sponsorPage = document.getElementById('sponsorPage');

  if (sponsorButton && sponsorPage) {
    sponsorButton.addEventListener('click', () => {
      closePowerDropdown();
      sponsorPage.classList.add('open');
      updateHeaderVisibility();
    });
  }

  if (closeSponsorButton && sponsorPage) {
    closeSponsorButton.addEventListener('click', () => {
      sponsorPage.classList.remove('open');
      updateHeaderVisibility();
    });
  }
}

// ===== POWER BUTTON =====
function setupPowerButton() {
  const powerButton = document.getElementById('powerButton');
  const powerDropdown = document.getElementById('powerDropdown');
  const dropdownOptions = document.querySelectorAll('.power-dropdown-option');
  
  browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakDuration', 'breakStartTime'], (result) => {
    const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    
    if (!isEnabled && result.breakStartTime && result.takeBreak) {
      startBreakCountdown(Number(result.breakStartTime), Number(result.breakDuration));
    }
  });
  
  powerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    browser.storage.sync.get(['extensionEnabled'], (result) => {
      const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
      if (!isEnabled) {
        browser.storage.sync.set({ 
          extensionEnabled: true, 
          breakStartTime: null,
          takeBreak: false 
        }, () => {
          if (browser.runtime.lastError) {
            console.error('LockedIn: Failed to save power state', browser.runtime.lastError);
            return;
          }
          browser.runtime.sendMessage({ action: 'cancelBreakTimer' }).catch(() => {});
          if (breakInterval) {
            clearInterval(breakInterval);
            breakInterval = null;
          }
          updatePowerState(true);
          browser.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              if (tab.url && tab.url.includes('youtube.com')) {
                browser.tabs.sendMessage(tab.id, {
                  action: 'powerStateChanged',
                  enabled: true
                }).catch(() => {});
              }
            });
          });
        });
      } else {
        powerDropdown.classList.toggle('open');
      }
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!powerButton.contains(e.target) && !powerDropdown.contains(e.target)) {
      powerDropdown.classList.remove('open');
    }
  });
  
  dropdownOptions.forEach(option => {
    option.addEventListener('click', () => {
      const duration = parseInt(option.dataset.duration, 10);
      powerDropdown.classList.remove('open');
      const saveData = { 
        extensionEnabled: false,
        takeBreak: duration > 0,
        breakDuration: duration
      };
      if (duration > 0) {
        saveData.breakStartTime = Date.now();
        browser.runtime.sendMessage({
          action: 'startBreakTimer',
          duration: duration
        }).catch(() => {});
        startBreakCountdown(saveData.breakStartTime, duration);
      } else {
        saveData.breakStartTime = null;
      }
      browser.storage.sync.set(saveData, () => {
        if (browser.runtime.lastError) {
          console.error('LockedIn: Failed to save power state', browser.runtime.lastError);
          return;
        }
        updatePowerState(false);
        browser.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url && tab.url.includes('youtube.com')) {
              browser.tabs.sendMessage(tab.id, {
                action: 'powerStateChanged',
                enabled: false
              }).catch(() => {});
            }
          });
        });
      });
    });
  });
}

function closePowerDropdown() {
  const dropdown = document.getElementById('powerDropdown');
  if (dropdown) {
    dropdown.classList.remove('open');
  }
}

function updateHeaderVisibility() {
  const popupContainer = document.querySelector('.popup-container');
  if (!popupContainer) return;
  const settingsMenu = document.getElementById('settingsMenu');
  const feedbackPage = document.getElementById('feedbackPage');
  const sponsorPage = document.getElementById('sponsorPage');
  const isMenuOpen = settingsMenu && settingsMenu.classList.contains('open');
  const overlayActive = !!(isMenuOpen ||
    (feedbackPage && feedbackPage.classList.contains('open')) ||
    (sponsorPage && sponsorPage.classList.contains('open')));
  popupContainer.classList.toggle('overlay-active', overlayActive);
  popupContainer.classList.toggle('menu-open', !!isMenuOpen);
}

function updateMenuDropdownDisplay(type, value) {
  const normalized = type === 'appearance'
    ? (APPEARANCE_OPTIONS.includes(value) ? value : 'auto')
    : (LANGUAGE_OPTIONS.includes(value) ? value : 'auto');
  const valueElement = document.getElementById(`${type}DropdownValue`);
  if (valueElement) {
    if (type === 'appearance') {
      const labelKey = APPEARANCE_LABEL_KEYS[normalized] || APPEARANCE_LABEL_KEYS.auto;
      valueElement.textContent = translate(labelKey) || translate(APPEARANCE_LABEL_KEYS.auto) || 'Auto';
    } else {
      const labelMeta = LANGUAGE_LABELS[normalized] || LANGUAGE_LABELS.auto;
      if (labelMeta.labelKey) {
        valueElement.textContent = translate(labelMeta.labelKey) || labelMeta.fallback || 'Auto';
      } else {
        valueElement.textContent = labelMeta.label;
      }
    }
  }
  const panel = document.querySelector(`.menu-inline-dropdown[data-dropdown-type="${type}"]`);
  if (panel) {
    panel.querySelectorAll('.menu-inline-option').forEach((option) => {
      option.classList.toggle('selected', option.dataset.value === normalized);
    });
  }
}

function closeMenuInlineDropdowns() {
  const dropdowns = document.querySelectorAll('.menu-inline-dropdown');
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('open');
    dropdown.style.top = '';
    dropdown.style.left = '';
    dropdown.style.maxHeight = '';
    dropdown.style.width = '';
    dropdown.style.visibility = '';
    const trigger = document.querySelector(`[data-menu-dropdown-target="${dropdown.id}"]`);
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function applyAppearanceSetting(value, options = {}) {
  const normalized = APPEARANCE_OPTIONS.includes(value) ? value : 'auto';
  currentAppearanceValue = normalized;
  const popupContainer = document.querySelector('.popup-container');
  const headerLogo = document.querySelector('.header-logo');
  const isDisabled = popupContainer.classList.contains('disabled');
  let isLightMode = false;
  if (normalized === 'light') {
    isLightMode = true;
  } else if (normalized === 'dark') {
    isLightMode = false;
  } else {
    isLightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  if (isLightMode) {
    popupContainer.classList.add('light-mode');
    if (headerLogo) {
      headerLogo.src = isDisabled ? '../icons/LightOff.png' : '../icons/iconFullLight.png';
    }
  } else {
    popupContainer.classList.remove('light-mode');
    if (headerLogo) {
      headerLogo.src = isDisabled ? '../icons/LockedOut.png' : '../icons/iconFull.png';
    }
  }
  updateMenuDropdownDisplay('appearance', normalized);
  if (!options.skipSave) {
    browser.storage.sync.set({ appearance: normalized });
  }
}

function applyLanguageSetting(value, options = {}) {
  const normalized = LANGUAGE_OPTIONS.includes(value) ? value : 'auto';
  currentLanguagePreference = normalized;
  const effectiveLanguage = resolveLanguagePreference(normalized);
  applyTranslations(effectiveLanguage);
  updateMenuDropdownDisplay('language', normalized);
  updateMenuDropdownDisplay('appearance', currentAppearanceValue);
  const statsSection = document.getElementById('statsSection');
  if (statsSection && statsSection.classList.contains('visible')) {
    browser.storage.local.get('stats', (result) => {
      const stats = { ...DEFAULT_STATS, ...result.stats };
      updateStatsDisplay(stats, false);
    });
  }
  browser.storage.sync.get(['extensionEnabled', 'takeBreak', 'breakStartTime', 'breakDuration'], (state) => {
    if (state && state.takeBreak && state.breakStartTime && state.breakDuration && state.extensionEnabled === false) {
      startBreakCountdown(Number(state.breakStartTime), Number(state.breakDuration));
    }
  });
  if (!options.skipSave) {
    browser.storage.sync.set({ language: normalized });
  }
}

function positionMenuDropdown(trigger, panel) {
  if (!trigger || !panel || !panel.classList.contains('open')) {
    return;
  }
  panel.style.visibility = 'hidden';
  panel.style.top = '0px';
  panel.style.left = '0px';
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  panel.style.maxHeight = `${Math.min(220, viewportHeight - margin * 2)}px`;
  const triggerRect = trigger.getBoundingClientRect();
  const desiredWidth = Math.max(triggerRect.width + 8, 118);
  panel.style.width = `${desiredWidth}px`;
  const panelRect = panel.getBoundingClientRect();
  const panelWidth = panelRect.width || desiredWidth;
  let panelHeight = panelRect.height || panel.scrollHeight || 0;
  if (panelHeight === 0) {
    panelHeight = Math.min(220, viewportHeight - margin * 2);
  }
  let left = triggerRect.left;
  if (left < margin) {
    left = margin;
  }
  if (left + panelWidth > viewportWidth - margin) {
    left = Math.max(margin, viewportWidth - margin - panelWidth);
  }
  let top = triggerRect.bottom + 4;
  if (top + panelHeight > viewportHeight - margin) {
    top = Math.max(margin, triggerRect.top - panelHeight - 4);
  }
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.visibility = 'visible';
}

function updatePowerState(isEnabled) {
  const popupContainer = document.querySelector('.popup-container');
  const breakTimerText = document.getElementById('breakTimerText');
  const headerLogo = document.querySelector('.header-logo');
  const isLightMode = popupContainer.classList.contains('light-mode');
  
  if (isEnabled) {
    popupContainer.classList.remove('disabled');
    if (breakTimerText) breakTimerText.style.display = 'none';
    if (headerLogo) {
      headerLogo.src = isLightMode ? '../icons/iconFullLight.png' : '../icons/iconFull.png';
    }
  } else {
    popupContainer.classList.add('disabled');
    if (headerLogo) {
      headerLogo.src = isLightMode ? '../icons/LightOff.png' : '../icons/LockedOut.png';
    }
  }
}

// ===== BREAK TIMER =====
let breakInterval = null;

function startBreakCountdown(startTime, duration) {
  const breakTimerText = document.getElementById('breakTimerText');
  if (!breakTimerText) return;
  
  breakTimerText.style.display = 'block';
  const breakPrefix = translate('state.breakTimerPrefix') || 'See you in';
  
  if (breakInterval) clearInterval(breakInterval);
  const normalizedDuration = Number(duration);
  const fallbackDuration = Number.isFinite(normalizedDuration) && normalizedDuration > 0 ? normalizedDuration : 5;
  let normalizedStart = Number(startTime);
  const now = Date.now();
  if (!Number.isFinite(normalizedStart) || normalizedStart <= 0) {
    normalizedStart = now;
    browser.storage.sync.set({ breakStartTime: normalizedStart });
  }
  const endTime = normalizedStart + (fallbackDuration * 60 * 1000);
  
  function updateTimer() {
    const currentTime = Date.now();
    const remaining = Math.max(0, endTime - currentTime);
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (remaining <= 0) {
      clearInterval(breakInterval);
      breakTimerText.textContent = `${breakPrefix} 0:00`;
      breakTimerText.style.display = 'none';
      updatePowerState(true);
      browser.runtime.sendMessage({ action: 'completeBreak' }).catch(() => {
        browser.storage.sync.set({ extensionEnabled: true, breakStartTime: null });
      });
      return;
    }
    
    breakTimerText.textContent = `${breakPrefix} ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  updateTimer();
  breakInterval = setInterval(updateTimer, 1000);
}

// ===== CUSTOM MEME UPLOAD =====
function setupCustomMemeUpload() {
  const fileInput = document.getElementById('customMemeInput');
  const gallery = document.getElementById('customMemeGallery');
  
  if (!fileInput || !gallery) return;
  if (fileInput.disabled || fileInput.dataset.disabled === 'true') return;
  
  function renderGallery(memes) {
    gallery.innerHTML = '';
    if (!memes || memes.length === 0) {
      gallery.classList.remove('visible');
      return;
    }
    gallery.classList.add('visible');
    memes.forEach((meme, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = meme;
      img.addEventListener('click', () => { window.open(meme, '_blank'); });
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'gallery-delete-btn';
      deleteBtn.innerHTML = '✕';
      deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteMeme(index); });
      item.appendChild(img);
      item.appendChild(deleteBtn);
      gallery.appendChild(item);
    });
  }

  function readFilesAsDataUrls(files) {
    return Promise.all(files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }));
  }
  
  function deleteMeme(index) {
    browser.storage.local.get('customMemes', (result) => {
      const memes = result.customMemes || [];
      memes.splice(index, 1);
      if (memes.length === 0) {
        browser.storage.local.remove('customMemes', () => {
          renderGallery([]);
          notifyContentScript(null);
        });
      } else {
        browser.storage.local.set({ customMemes: memes }, () => {
          renderGallery(memes);
          notifyContentScript(memes);
        });
      }
    });
  }
  
  function notifyContentScript(memes) {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'customMemesUpdated', memes: memes }).catch(() => {});
      }
    });
  }
  
  browser.storage.local.get('customMemes', (result) => {
    if (result.customMemes && result.customMemes.length > 0) renderGallery(result.customMemes);
  });
  
  fileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    browser.storage.local.get('customMemes', (result) => {
      const existingMemes = result.customMemes || [];
      const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      const validFiles = [];
      for (const file of files) {
        if (file.size > 500 * 1024) { alert(translate('customMeme.tooLarge', { filename: file.name })); continue; }
        if (!validTypes.includes(file.type)) { alert(translate('customMeme.invalidType', { filename: file.name })); continue; }
        validFiles.push(file);
      }
      if (existingMemes.length + validFiles.length > 5) { alert(translate('customMeme.maxImages', { existing: existingMemes.length, added: validFiles.length })); fileInput.value = ''; return; }
      if (validFiles.length === 0) { fileInput.value = ''; return; }
      readFilesAsDataUrls(validFiles).then((dataUrls) => {
        const newMemes = dataUrls.filter(Boolean);
        if (newMemes.length === 0) { fileInput.value = ''; return; }
        const allMemes = [...existingMemes, ...newMemes];
        renderGallery(allMemes);
        browser.storage.local.set({ customMemes: allMemes }, () => {
          fileInput.value = '';
          notifyContentScript(allMemes);
        });
      });
    });
  });
}

// ===== STATS =====
function loadStats() {
  browser.storage.sync.get(['showStats'], (result) => {
    const statsSection = document.getElementById('statsSection');
    const showStats = result.showStats || false;
    if (showStats) {
      statsSection.classList.add('visible');
      browser.storage.local.get('stats', (localResult) => {
        const stats = { ...DEFAULT_STATS, ...localResult.stats };
        updateStatsDisplay(stats, true);
      });
    } else {
      statsSection.classList.remove('visible');
    }
  });
}

function animateCounter(element, targetValue, duration = 800, suffix = '') {
  if (!element) return;
  element.textContent = '0' + suffix;
  const startValue = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
    element.textContent = currentValue + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = targetValue + suffix;
  }
  setTimeout(() => requestAnimationFrame(update), 50);
}

function updateStatsDisplay(stats, animate = false) {
  const estimatedTimeSaved = 
    (stats.shortsBlocked || 0) * TIME_SAVED_ESTIMATES.short +
    (stats.recsHidden || 0) * TIME_SAVED_ESTIMATES.recommendation +
    (stats.endCardsBlocked || 0) * TIME_SAVED_ESTIMATES.endCard +
    (stats.autoplayStops || 0) * TIME_SAVED_ESTIMATES.autoplay;
  
  const timeSavedEl = document.getElementById('statTimeSaved');
  const timeLabelEl = document.getElementById('statTimeLabel');
  const hoursSuffix = translate('stats.hoursSuffix') || 'hr';
  const minSavedLabel = translate('stats.minSaved') || 'Min Saved';
  const timeSavedLabel = translate('stats.timeSaved') || 'Time Saved';
  if (timeSavedEl && timeLabelEl) {
    if (estimatedTimeSaved > 999) {
      const hours = (estimatedTimeSaved / 60).toFixed(1);
      timeLabelEl.textContent = timeSavedLabel;
      if (animate) {
        animateCounter(timeSavedEl, Math.floor(estimatedTimeSaved / 60), 800, hoursSuffix);
        setTimeout(() => { timeSavedEl.textContent = `${hours}${hoursSuffix}`; }, 850);
      } else timeSavedEl.textContent = `${hours}${hoursSuffix}`;
    } else {
      timeLabelEl.textContent = minSavedLabel;
      if (animate) animateCounter(timeSavedEl, Math.round(estimatedTimeSaved), 800);
      else timeSavedEl.textContent = Math.round(estimatedTimeSaved);
    }
  }
  const shortsEl = document.getElementById('statShortsBlocked');
  if (shortsEl) {
    const shortsValue = stats.shortsBlocked || 0;
    if (shortsValue > 999) {
      const kValue = (shortsValue / 1000).toFixed(1);
      const displayValue = kValue.endsWith('.0') ? Math.floor(shortsValue / 1000) + 'k' : kValue + 'k';
      if (animate) {
        animateCounter(shortsEl, Math.floor(shortsValue / 1000), 900, 'k');
        setTimeout(() => { shortsEl.textContent = displayValue; }, 950);
      } else shortsEl.textContent = displayValue;
    } else {
      if (animate) animateCounter(shortsEl, shortsValue, 900);
      else shortsEl.textContent = shortsValue;
    }
  }
  const daysEl = document.getElementById('statDaysActive');
  if (daysEl) {
    let daysValue = 1;
    if (stats.firstUseDate) daysValue = Math.max(1, Math.floor((Date.now() - stats.firstUseDate) / (1000 * 60 * 60 * 24)));
    if (animate) animateCounter(daysEl, daysValue, 700);
    else daysEl.textContent = daysValue;
  }
}

// ===== LOAD SETTINGS =====
function loadSettings() {
  return new Promise((resolve) => {
    const toggles = document.querySelectorAll('input[type="checkbox"]');
    browser.storage.sync.get(null, (settings) => {
      const currentSettings = { ...DEFAULT_SETTINGS, ...settings };
      toggles.forEach((toggle) => {
        const settingId = toggle.dataset.setting;
        if (currentSettings[settingId] !== undefined) toggle.checked = currentSettings[settingId];
      });
      const popupContainer = document.querySelector('.popup-container');
      if (popupContainer) popupContainer.classList.toggle('disabled', !currentSettings.extensionEnabled);
      let savedAppearance = currentSettings.appearance || 'auto';
      if (savedAppearance === 'auto' && currentSettings.lightMode) savedAppearance = 'light';
      applyAppearanceSetting(savedAppearance, { skipSave: true });
      applyLanguageSetting(currentSettings.language || 'auto', { skipSave: true });
      if (currentSettings.showStats) document.getElementById('statsSection').classList.add('visible');
      if (currentSettings.hideFeed) document.getElementById('redirectToSubsRow').classList.add('visible');
      const sidebarSubToggles = document.getElementById('sidebarSubToggles');
      if (!currentSettings.hideSidebar) sidebarSubToggles?.classList.add('visible');
      else sidebarSubToggles?.classList.remove('visible');
      resolve();
    });
  });
}

// ===== TOGGLE LISTENERS =====
function setupToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const settingId = e.target.dataset.setting;
      const isChecked = e.target.checked;
      if (settingId === 'showStats') {
        const statsSection = document.getElementById('statsSection');
        if (isChecked) {
          statsSection.classList.add('visible');
          browser.storage.local.get('stats', (result) => {
            const stats = { ...DEFAULT_STATS, ...result.stats };
            if (!stats.firstUseDate) { stats.firstUseDate = Date.now(); browser.storage.local.set({ stats }); }
            updateStatsDisplay(stats, true);
          });
        } else statsSection.classList.remove('visible');
      }
      if (settingId === 'hideFeed') {
        const row = document.getElementById('redirectToSubsRow');
        if (isChecked) row.classList.add('visible');
        else {
          row.classList.remove('visible');
          const redirectToggle = document.querySelector('input[data-setting="redirectToSubs"]');
          if (redirectToggle && redirectToggle.checked) { redirectToggle.checked = false; browser.storage.sync.set({ redirectToSubs: false }); }
        }
      }
      if (settingId === 'hideSidebar') {
        const sub = document.getElementById('sidebarSubToggles');
        if (!isChecked) sub?.classList.add('visible');
        else {
          sub?.classList.remove('visible');
          ['hideRecommended', 'hideSidebarShorts', 'hidePlaylists'].forEach(s => {
            const t = document.querySelector(`input[data-setting="${s}"]`);
            if (t && t.checked) { t.checked = false; browser.storage.sync.set({ [s]: false }); }
          });
        }
      }
      browser.storage.sync.set({ [settingId]: isChecked }, () => {
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) browser.tabs.sendMessage(tabs[0].id, { action: 'settingChanged', setting: settingId, value: isChecked }).catch(() => {});
        });
      });
    });
  });
  setupDropdownListeners();
}

function setupDropdownListeners() {
  const triggers = document.querySelectorAll('[data-menu-dropdown-trigger]');
  triggers.forEach((trigger) => {
    const panel = document.getElementById(trigger.dataset.menuDropdownTarget);
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      closeMenuInlineDropdowns();
      if (!isOpen) { panel.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); requestAnimationFrame(() => positionMenuDropdown(trigger, panel)); }
    });
  });
  document.querySelectorAll('.menu-inline-option').forEach((option) => {
    option.addEventListener('click', () => {
      const type = option.closest('.menu-inline-dropdown').dataset.dropdownType;
      const val = option.dataset.value;
      if (type === 'appearance') applyAppearanceSetting(val);
      else if (type === 'language') applyLanguageSetting(val);
      closeMenuInlineDropdowns();
    });
  });
  document.addEventListener('click', closeMenuInlineDropdowns);
  window.addEventListener('resize', () => {
    const open = document.querySelector('.menu-inline-dropdown.open');
    if (open) positionMenuDropdown(document.querySelector(`[data-menu-dropdown-target="${open.id}"]`), open);
  });
}

function setupBreakTimer() {
  const btns = document.querySelectorAll('.break-time-btn');
  browser.storage.sync.get('breakDuration', (res) => {
    const dur = res.breakDuration ?? 5;
    btns.forEach(b => {
      const bDur = b.dataset.time ? parseFloat(b.dataset.time) : (b.dataset.seconds ? parseFloat(b.dataset.seconds) / 60 : null);
      if (bDur !== null && Math.abs(bDur - dur) < 0.001) b.classList.add('selected');
    });
  });
  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('selected')); b.classList.add('selected');
      const dur = b.dataset.time ? parseFloat(b.dataset.time) : (b.dataset.seconds ? parseFloat(b.dataset.seconds) / 60 : 5);
      browser.storage.sync.set({ breakDuration: dur });
    });
  });
}