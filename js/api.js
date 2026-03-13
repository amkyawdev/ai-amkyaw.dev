/*
 * Amkyaw.Dev - API Connection
 * Handles communication with AI backend
 */

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://ai.amkyaw.workers.dev',
    endpoints: {
        chat: '/',
        code: '/',
        translate: '/',
        summarize: '/',
        roleplay: '/'
    },
    timeout: 30000,
    retries: 2
};

// Build API URL
function buildApiUrl(mode, message, options = {}) {
    const endpoint = API_CONFIG.endpoints[mode] || API_CONFIG.endpoints.chat;
    const url = new URL(API_CONFIG.baseUrl + endpoint);
    
    // Add mode
    url.searchParams.set('mode', mode);
    
    // Add message
    url.searchParams.set('msg', encodeURIComponent(message));
    
    // Add additional options
    if (options.lang) {
        url.searchParams.set('lang', options.lang);
    }
    
    if (options.persona) {
        url.searchParams.set('persona', options.persona);
    }
    
    if (options.context) {
        url.searchParams.set('context', options.context);
    }
    
    return url.toString();
}

// Make API request
async function apiRequest(url, options = {}) {
    const { timeout = API_CONFIG.timeout, retries = API_CONFIG.retries } = options;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain, application/json',
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.text();
            return { success: true, data };
            
        } catch (error) {
            lastError = error;
            
            if (error.name === 'AbortError') {
                console.warn(`Request timeout (attempt ${attempt + 1}/${retries + 1})`);
            } else {
                console.error(`Request failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);
            }
            
            // Wait before retrying
            if (attempt < retries) {
                await sleep(1000 * (attempt + 1));
            }
        }
    }
    
    return { 
        success: false, 
        error: lastError.message || 'Request failed' 
    };
}

// Ask AI - main function
async function askAI(message, mode = 'chat', options = {}) {
    // Build prompt using engine
    const prompt = buildPrompt(mode, message, options);
    
    // Build API URL
    const url = buildApiUrl(mode, message, options);
    
    // Make request
    const result = await apiRequest(url);
    
    if (result.success) {
        // Process response using engine
        const processedResponse = processResponse(result.data, mode);
        
        return { 
            success: true, 
            response: processedResponse,
            rawResponse: result.data
        };
    } else {
        return { 
            success: false, 
            error: result.error 
        };
    }
}

// Chat mode
async function chat(message, context = null) {
    return askAI(message, 'chat', { context });
}

// Code generation
async function generateCode(message) {
    return askAI(message, 'code');
}

// Translate
async function translate(message, targetLang = 'en') {
    return askAI(message, 'translate', { lang: targetLang });
}

// Summarize
async function summarize(message) {
    return askAI(message, 'summarize');
}

// Roleplay
async function roleplay(message, persona = 'assistant', context = null) {
    return askAI(message, 'roleplay', { persona, context });
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get API status
async function getApiStatus() {
    try {
        const response = await fetch(API_CONFIG.baseUrl, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(5000) 
        });
        return { online: response.ok, status: response.status };
    } catch {
        return { online: false, status: 0 };
    }
}

// Export functions
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;
window.apiRequest = apiRequest;
window.askAI = askAI;
window.chat = chat;
window.generateCode = generateCode;
window.translate = translate;
window.summarize = summarize;
window.roleplay = roleplay;
window.getApiStatus = getApiStatus;
