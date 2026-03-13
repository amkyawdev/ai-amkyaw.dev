/*
 * Amkyaw.Dev - Router System
 * Client-side page navigation
 */

// Router configuration
const ROUTER_CONFIG = {
    defaultRoute: 'pages/chat.html',
    routes: {
        'chat': 'pages/chat.html',
        'coder': 'pages/coder.html',
        'translate': 'pages/translate.html',
        'summarize': 'pages/summarize.html',
        'roleplay': 'pages/roleplay.html',
        'parameter': 'pages/parameter.html',
        'login': 'pages/login.html',
        'register': 'pages/register.html',
        'reset': 'pages/reset.html'
    }
};

// Page routes mapping
const PAGES = {
    '/': 'pages/chat.html',
    '/index.html': 'pages/chat.html',
    '/chat.html': 'pages/chat.html',
    '/coder.html': 'pages/coder.html',
    '/translate.html': 'pages/translate.html',
    '/summarize.html': 'pages/summarize.html',
    '/roleplay.html': 'pages/roleplay.html',
    '/parameter.html': 'pages/parameter.html',
    '/login.html': 'pages/login.html',
    '/register.html': 'pages/register.html',
    '/reset.html': 'pages/reset.html'
};

// Navigate to a route
function navigate(route, params = {}) {
    let url = ROUTER_CONFIG.routes[route] || ROUTER_CONFIG.defaultRoute;
    
    // Add query parameters if provided
    if (Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        url += '?' + queryString;
    }
    
    window.location.href = url;
}

// Navigate to page by name
function navigateTo(pageName, params = {}) {
    navigate(pageName, params);
}

// Get current route
function getCurrentRoute() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Find matching route
    for (const [route, url] of Object.entries(ROUTER_CONFIG.routes)) {
        if (url.includes(pageName)) {
            return route;
        }
    }
    
    return page;
}

// Get page name from URL
function getPageName() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
}

// Get query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
}

// Get single query parameter
function getQueryParam(name, defaultValue = null) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || defaultValue;
}

// Check if current page
function isPage(pageName) {
    return getPageName() === pageName;
}

// Check if on any of the given pages
function isAnyPage(pageNames) {
    const currentPage = getPageName();
    return pageNames.includes(currentPage);
}

// Reload current page
function reloadPage() {
    window.location.reload();
}

// Go back
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigate('chat');
    }
}

// Refresh page with new params
function refreshWithParams(params) {
    const currentUrl = window.location.href.split('?')[0];
    const queryString = new URLSearchParams(params).toString();
    
    if (queryString) {
        window.location.href = currentUrl + '?' + queryString;
    } else {
        window.location.href = currentUrl;
    }
}

// Link click handler for SPA-like navigation
function initRouter() {
    // Handle link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('http')) {
                navigateTo(href);
            } else if (href) {
                window.location.href = href;
            }
        }
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        // Re-render current page content if needed
    });
}

// Initialize router on load
document.addEventListener('DOMContentLoaded', initRouter);

// Export functions
window.navigate = navigate;
window.navigateTo = navigateTo;
window.getCurrentRoute = getCurrentRoute;
window.getPageName = getPageName;
window.getQueryParams = getQueryParams;
window.getQueryParam = getQueryParam;
window.isPage = isPage;
window.isAnyPage = isAnyPage;
window.reloadPage = reloadPage;
window.goBack = goBack;
window.refreshWithParams = refreshWithParams;
