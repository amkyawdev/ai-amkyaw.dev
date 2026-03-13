/*
 * Amkyaw.Dev - Loader System
 * Handles the initial loading animation and transition
 */

// Loader configuration
const LOADER_CONFIG = {
    duration: 2000, // 2 seconds minimum
    minDuration: 1500,
    targetPage: 'pages/chat.html'
};

// Show loader
function showLoader() {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.style.display = 'flex';
    }
}

// Hide loader with animation
function hideLoader(callback) {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            loader.style.display = 'none';
            if (callback) callback();
        }, 500);
    }
}

// Initialize loader
function initLoader() {
    const startTime = Date.now();
    
    // Check if this is first visit
    const hasVisited = localStorage.getItem('amkyaw_visited');
    
    if (!hasVisited) {
        // First visit - show full loader
        localStorage.setItem('amkyaw_visited', 'true');
        runLoader(startTime, true);
    } else {
        // Returning visitor - quick loader
        runLoader(startTime, false);
    }
}

// Run loader animation
function runLoader(startTime, isFirstVisit) {
    const duration = isFirstVisit ? LOADER_CONFIG.duration : LOADER_CONFIG.minDuration;
    
    // Animate progress bar
    const progressBar = document.querySelector('.loader-progress-bar');
    if (progressBar) {
        progressBar.style.transition = `width ${duration}ms ease-out`;
        progressBar.style.width = '100%';
    }
    
    // Navigate after duration
    setTimeout(() => {
        hideLoader(() => {
            // Check if there's a stored redirect URL
            const redirectUrl = sessionStorage.getItem('redirect_url');
            if (redirectUrl) {
                sessionStorage.removeItem('redirect_url');
                window.location.href = redirectUrl;
            } else {
                window.location.href = LOADER_CONFIG.targetPage;
            }
        });
    }, duration);
}

// Set redirect URL (for protected pages)
function setRedirectUrl(url) {
    sessionStorage.setItem('redirect_url', url);
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

// Check if on index page
function isIndexPage() {
    return getCurrentPage() === 'index.html' || getCurrentPage() === '';
}

// Preload page
async function preloadPage(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Smooth page transition
function transitionToPage(url) {
    const container = document.body;
    
    // Add exit animation
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (isIndexPage()) {
        initLoader();
    }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (isIndexPage()) {
        initLoader();
    }
}

// Export functions
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.setRedirectUrl = setRedirectUrl;
window.transitionToPage = transitionToPage;
window.getCurrentPage = getCurrentPage;
window.isIndexPage = isIndexPage;
