/*
 * Amkyaw.Dev - UI Behavior
 * Handles UI interactions and components
 */

// ===== Theme =====
// Check and apply theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===== Mobile Menu =====
// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Close mobile menu
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ===== Dropdown =====
// Toggle dropdown
function toggleDropdown(element) {
    element.classList.toggle('active');
}

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// ===== Modal =====
// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
function initModalCloseOnOverlay() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ===== Tabs =====
// Switch tab
function switchTab(tabId, contentId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show target content
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
}

// ===== Tooltip =====
// Show tooltip
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-content';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 12px;
        background: var(--bg-darker, #050508);
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    }, 10);
}

// Hide tooltip
function hideTooltip(element) {
    const tooltip = element.querySelector('.tooltip-content');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== Notifications =====
// Show notification
function showUINotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existing = document.querySelector('.ui-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `ui-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${getNotificationIcon(type)}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid ${getNotificationBorderColor(type)};
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// Get notification border color
function getNotificationBorderColor(type) {
    const colors = {
        success: 'rgba(0, 255, 136, 0.3)',
        error: 'rgba(255, 107, 107, 0.3)',
        warning: 'rgba(255, 217, 61, 0.3)',
        info: 'rgba(0, 212, 255, 0.3)'
    };
    return colors[type] || colors.info;
}

// ===== Copy to Clipboard =====
// Copy text
async function copyToClipboard(text, showNotification = true) {
    try {
        await navigator.clipboard.writeText(text);
        
        if (showNotification) {
            showUINotification('Copied to clipboard!', 'success', 2000);
        }
        
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        
        if (showNotification) {
            showUINotification('Failed to copy', 'error', 2000);
        }
        
        return false;
    }
}

// Copy element content
function copyElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        return copyToClipboard(element.textContent);
    }
    return false;
}

// ===== Local Storage =====
// Save to local storage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Failed to save to storage:', e);
        return false;
    }
}

// Get from local storage
function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('Failed to get from storage:', e);
        return defaultValue;
    }
}

// Remove from local storage
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
}

// ===== Format =====
// Format text (escape HTML)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format code
function formatCode(code, language = '') {
    return `\`\`\`${language}\n${code}\n\`\`\``;
}

// Parse markdown-like formatting
function parseFormatting(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// ===== Initialize =====
// Initialize all UI components
function initUI() {
    initTheme();
    initModalCloseOnOverlay();
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-btn')) {
            closeMobileMenu();
        }
    });
    
    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
            closeMobileMenu();
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initUI);

// Export functions
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleDropdown = toggleDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;
window.showUINotification = showUINotification;
window.copyToClipboard = copyToClipboard;
window.copyElement = copyElement;
window.saveToStorage = saveToStorage;
window.getFromStorage = getFromStorage;
window.removeFromStorage = removeFromStorage;
window.escapeHtml = escapeHtml;
window.formatCode = formatCode;
window.parseFormatting = parseFormatting;
