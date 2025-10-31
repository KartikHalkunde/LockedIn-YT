// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

if (mobileMenuToggle && navLinks) {
    // Toggle menu
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.toggle('active');
        }
        // Change icon between hamburger and X
        mobileMenuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
            mobileMenuToggle.textContent = '☰';
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
            document.body.style.overflow = '';
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detect user's browser and highlight appropriate download button
function detectBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    let browserType = '';
    if (userAgent.includes('edg')) {
        browserType = 'edge';
    } else if (userAgent.includes('firefox')) {
        browserType = 'firefox';
    } else if (userAgent.includes('chrome')) {
        browserType = 'chrome';
    }
    
    // Add subtle pulse animation to recommended button
    downloadButtons.forEach(btn => {
        if (btn.classList.contains(browserType)) {
            btn.style.animation = 'pulse 2s infinite';
            
            // Add "Recommended" badge
            const badge = document.createElement('span');
            badge.textContent = 'Recommended';
            badge.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background-color: #4CAF50;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: bold;
            `;
            btn.style.position = 'relative';
            btn.appendChild(badge);
        }
    });
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
        }
        50% {
            box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
        }
    }
`;
document.head.appendChild(style);

// Run browser detection on page load
detectBrowser();

// Add scroll animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.problem-card, .feature-group, .privacy-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add active state to navbar on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
    
    lastScroll = currentScroll;
});

// Track download button clicks (for analytics if needed later)
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        let browser = 'Unknown';
        if (btn.classList.contains('firefox')) browser = 'Firefox';
        else if (btn.classList.contains('chrome')) browser = 'Chrome';
        else if (btn.classList.contains('edge')) browser = 'Edge';
        
        console.log(`Download clicked: ${browser}`);
        
        // You can add analytics here later, e.g., Google Analytics
        // gtag('event', 'download_click', { browser: browser });
    });
});

// Mobile menu toggle (if needed in future)
const createMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.createElement('button');
    
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    `;
    
    // Insert menu toggle before nav links
    navLinks.parentNode.insertBefore(menuToggle, navLinks);
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });
    
    // Show menu toggle on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobile = (e) => {
        if (e.matches) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            navLinks.classList.remove('mobile-active');
        }
    };
    
    mediaQuery.addListener(handleMobile);
    handleMobile(mediaQuery);
};

// Initialize mobile menu if on small screen
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Add copy-to-clipboard for install commands (if you add them later)
const addCopyButtons = () => {
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.classList.add('copy-button');
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = 'Copy', 2000);
        });
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(button);
    });
};

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Browser detection and smart download button
const downloadBtn = document.getElementById('headerDownloadBtn');

if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Detect Firefox
        if (userAgent.indexOf('firefox') > -1) {
            window.open('https://addons.mozilla.org/firefox/addon/lockedin-yt/', '_blank');
        }
        // Detect Edge
        else if (userAgent.indexOf('edg') > -1) {
            window.open('https://microsoftedge.microsoft.com/addons/detail/hibjbjgfbmhpiaapeccnfddnpabnlklj', '_blank');
        }
        // Chrome and other Chromium-based browsers
        else if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('chromium') > -1) {
            alert('Not available on Chrome Web Store yet. Coming soon!');
        }
        // Safari
        else if (userAgent.indexOf('safari') > -1) {
            alert('Not available on Safari yet. Coming soon!');
        }
        // Other browsers
        else {
            alert('Extension currently available for Firefox and Edge. Chrome Web Store version coming soon!');
        }
    });
}

// Rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Feedback button handler
const feedbackBtn = document.getElementById('feedbackBtn');
if (feedbackBtn) {
    feedbackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // You can replace this URL with your Google Form link
        const formURL = 'YOUR_GOOGLE_FORM_URL_HERE';
        window.open(formURL, '_blank');
    });
}

// Log a friendly message to developers
console.log('%c👋 Hey developer!', 'font-size: 20px; font-weight: bold; color: #FF4444;');
console.log('%cLockedIn is open source! Check out the code at:', 'font-size: 14px; color: #AAAAAA;');
console.log('%chttps://github.com/KartikHalkunde/LockedIn-YT', 'font-size: 14px; color: #4285F4; text-decoration: underline;');
console.log('%cContributions are welcome! 🚀', 'font-size: 14px; color: #4CAF50;');
