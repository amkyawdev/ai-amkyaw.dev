/*
 * Amkyaw.Dev - AI Thinking Engine
 * Handles prompt building, intent detection, and response formatting
 */

// AI Configuration
const AI_CONFIG = {
    modes: {
        chat: {
            name: 'Chat',
            description: 'General AI conversation',
            systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and friendly responses.'
        },
        code: {
            name: 'Code',
            description: 'Programming generator',
            systemPrompt: 'You are an expert programmer. Generate clean, well-documented code with proper formatting. Always use markdown code blocks.'
        },
        translate: {
            name: 'Translate',
            description: 'Language translator',
            systemPrompt: 'You are a professional translator. Provide accurate translations while preserving the original meaning and tone.'
        },
        summarize: {
            name: 'Summarize',
            description: 'Text summarizer',
            systemPrompt: 'You are an expert at summarizing content. Create concise, clear summaries that capture the main points.'
        },
        roleplay: {
            name: 'Roleplay',
            description: 'AI personality mode',
            systemPrompt: 'You are roleplaying as a character. Stay in character and respond appropriately to the context.'
        }
    },
    defaultMode: 'chat'
};

// Intent detection patterns
const INTENT_PATTERNS = {
    code: [
        /code|program|script|function|class|html|css|javascript|python|java|c\+\+|sql|mysql|react|node|api|database/i,
        /write|create|build|make|generate|develop/i,
        /login|form|button|input|header|footer|card|modal/i
    ],
    translate: [
        /translate|translation|convert|change.*language|english|myanmar|burmese|japanese|chinese|korean/i,
        /en |mm |jp |cn |kr /i,
        /meaning|definition|what is/i
    ],
    summarize: [
        /summarize|summary|short|brief|concise|overview|key points|main idea/i,
        /tl;dr|tldr|long|article|document/i
    ],
    roleplay: [
        /roleplay|act as|pretend|扮演|角色|シミュレーション/i,
        /be like|character|personality/i
    ]
};

// Detect intent from user message
function detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(lowerMessage)) {
                return intent;
            }
        }
    }
    
    return AI_CONFIG.defaultMode;
}

// Build prompt based on mode and message
function buildPrompt(mode, message, options = {}) {
    const { targetLang, persona, context } = options;
    
    let prompt = '';
    
    switch (mode) {
        case 'chat':
            prompt = buildChatPrompt(message, context);
            break;
            
        case 'code':
            prompt = buildCodePrompt(message);
            break;
            
        case 'translate':
            prompt = buildTranslatePrompt(message, targetLang);
            break;
            
        case 'summarize':
            prompt = buildSummarizePrompt(message);
            break;
            
        case 'roleplay':
            prompt = buildRoleplayPrompt(message, persona, context);
            break;
            
        default:
            prompt = message;
    }
    
    return prompt;
}

// Build chat prompt
function buildChatPrompt(message, context) {
    let prompt = AI_CONFIG.modes.chat.systemPrompt + '\n\n';
    
    if (context) {
        prompt += `Context: ${context}\n\n`;
    }
    
    prompt += `User: ${message}\n\nAssistant:`;
    
    return prompt;
}

// Build code prompt
function buildCodePrompt(message) {
    let prompt = AI_CONFIG.modes.code.systemPrompt + '\n\n';
    
    // Detect programming language
    const language = detectLanguage(message);
    
    prompt += `Generate ${language || 'appropriate'} code for the following request:\n${message}\n\n`;
    prompt += 'Use markdown code blocks with proper syntax highlighting.\n';
    prompt += 'If there are multiple approaches, explain the best one.\n';
    
    return prompt;
}

// Detect programming language
function detectLanguage(message) {
    const lowerMessage = message.toLowerCase();
    
    const languagePatterns = {
        'python': /python|py |django|flask|fastapi/i,
        'javascript': /javascript|js |node|react|vue|angular|frontend/i,
        'html': /html|html5|web page|website/i,
        'css': /css|style|styling/i,
        'java': /java|spring|android/i,
        'cpp': /c\+\+|c programming/i,
        'c#': /c#|csharp|\.net|mvc/i,
        'sql': /sql|mysql|postgresql|database|query/i,
        'typescript': /typescript|ts |angular/i,
        'php': /php|laravel|wordpress/i,
        'ruby': /ruby|rails/i,
        'go': /golang|go programming/i,
        'rust': /rust|rustlang/i
    };
    
    for (const [lang, pattern] of Object.entries(languagePatterns)) {
        if (pattern.test(lowerMessage)) {
            return lang;
        }
    }
    
    return null;
}

// Build translate prompt
function buildTranslatePrompt(message, targetLang) {
    let prompt = AI_CONFIG.modes.translate.systemPrompt + '\n\n';
    
    if (targetLang) {
        prompt += `Translate the following text to ${targetLang}:\n`;
    } else {
        prompt += 'Translate the following text accurately:\n';
    }
    
    prompt += `\n${message}\n\n`;
    prompt += 'Provide only the translation, no explanations.';
    
    return prompt;
}

// Build summarize prompt
function buildSummarizePrompt(message) {
    let prompt = AI_CONFIG.modes.summarize.systemPrompt + '\n\n';
    
    prompt += 'Create a concise summary of the following text:\n\n';
    prompt += `${message}\n\n`;
    prompt += 'Summary should be clear, brief, and capture the main points.';
    
    return prompt;
}

// Build roleplay prompt
function buildRoleplayPrompt(message, persona, context) {
    let prompt = '';
    
    if (persona) {
        prompt = `You are ${persona}. ${AI_CONFIG.modes.roleplay.systemPrompt}\n\n`;
    } else {
        prompt = AI_CONFIG.modes.roleplay.systemPrompt + '\n\n';
    }
    
    if (context) {
        prompt += `Context: ${context}\n\n`;
    }
    
    prompt += `Respond as your character to:\n${message}`;
    
    return prompt;
}

// Format response based on mode
function formatResponse(response, mode) {
    switch (mode) {
        case 'code':
            return formatCodeResponse(response);
            
        case 'translate':
            return formatTranslateResponse(response);
            
        case 'summarize':
            return formatSummarizeResponse(response);
            
        default:
            return formatChatResponse(response);
    }
}

// Format code response
function formatCodeResponse(response) {
    // Extract code blocks if not already formatted
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const hasCodeBlock = codeBlockRegex.test(response);
    
    if (!hasCodeBlock) {
        // Try to detect code and wrap in markdown
        const codePatterns = [
            /function\s+\w+/,
            /class\s+\w+/,
            /const\s+\w+/,
            /let\s+\w+/,
            /def\s+\w+/,
            /import\s+.*from/,
            /<\w+.*>.*<\/\w+>/,
            /\.{\s*[\w-]+\s*:\s*[^}]+}/
        ];
        
        const isCode = codePatterns.some(pattern => pattern.test(response));
        
        if (isCode) {
            return '```\n' + response.trim() + '\n```';
        }
    }
    
    return response;
}

// Format translate response
function formatTranslateResponse(response) {
    // Clean up and return translation
    return response.trim();
}

// Format summarize response
function formatSummarizeResponse(response) {
    return response.trim();
}

// Format chat response
function formatChatResponse(response) {
    return response.trim();
}

// Process AI response
function processResponse(response, mode) {
    let processed = response;
    
    // Apply mode-specific formatting
    processed = formatResponse(processed, mode);
    
    // Common cleanup
    processed = processed
        .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
        .trim();
    
    return processed;
}

// Get mode info
function getModeInfo(mode) {
    return AI_CONFIG.modes[mode] || AI_CONFIG.modes[AI_CONFIG.defaultMode];
}

// Get all available modes
function getAllModes() {
    return Object.entries(AI_CONFIG.modes).map(([key, value]) => ({
        id: key,
        ...value
    }));
}

// Validate mode
function isValidMode(mode) {
    return mode in AI_CONFIG.modes;
}

// Export functions
window.AI_CONFIG = AI_CONFIG;
window.detectIntent = detectIntent;
window.buildPrompt = buildPrompt;
window.formatResponse = formatResponse;
window.processResponse = processResponse;
window.getModeInfo = getModeInfo;
window.getAllModes = getAllModes;
window.isValidMode = isValidMode;
