/**
 * Raksha Bandhan Website - Main JavaScript File
 * Contains shared functions for sister data management
 */

// Global variables
let sistersData = [];

/**
 * Load sisters data from JSON file
 * @returns {Promise<Array>} Array of sister objects
 */
async function loadSistersData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        sistersData = await response.json();
        return sistersData;
    } catch (error) {
        console.error('Error loading sisters data:', error);
        // Return empty array if data can't be loaded
        sistersData = [];
        return sistersData;
    }
}

/**
 * Check if a sister exists in the data
 * @param {string} name - Sister's name to search for
 * @returns {Promise<boolean>} True if sister exists, false otherwise
 */
async function checkSisterExists(name) {
    try {
        if (sistersData.length === 0) {
            await loadSistersData();
        }
        
        const normalizedSearchName = name.toLowerCase().trim();
        return sistersData.some(sister => 
            sister.name.toLowerCase().trim() === normalizedSearchName
        );
    } catch (error) {
        console.error('Error checking sister existence:', error);
        return false;
    }
}

/**
 * Get sister data by name
 * @param {string} name - Sister's name
 * @returns {Promise<Object|null>} Sister object or null if not found
 */
async function getSisterData(name) {
    try {
        if (sistersData.length === 0) {
            await loadSistersData();
        }
        
        const normalizedSearchName = name.toLowerCase().trim();
        const sister = sistersData.find(sister => 
            sister.name.toLowerCase().trim() === normalizedSearchName
        );
        
        return sister || null;
    } catch (error) {
        console.error('Error getting sister data:', error);
        return null;
    }
}

/**
 * Validate sister data object
 * @param {Object} sisterData - Sister data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateSisterData(sisterData) {
    const errors = [];
    
    if (!sisterData.name || sisterData.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!sisterData.greeting || sisterData.greeting.trim() === '') {
        errors.push('Greeting is required');
    }
    
    if (!sisterData.message || sisterData.message.trim() === '') {
        errors.push('Message is required');
    }
    
    // Validate image URLs if provided
    if (sisterData.images && Array.isArray(sisterData.images)) {
        sisterData.images.forEach((url, index) => {
            if (url && url.trim() !== '') {
                try {
                    new URL(url);
                } catch (e) {
                    errors.push(`Image URL ${index + 1} is not valid`);
                }
            }
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML string
 */
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

/**
 * Format text for display (handle line breaks, etc.)
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
function formatText(text) {
    if (!text) return '';
    
    // Sanitize the text first
    const sanitized = sanitizeHTML(text);
    
    // Convert line breaks to <br> tags
    return sanitized.replace(/\n/g, '<br>');
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${sanitizeHTML(message)}</span>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

/**
 * Get icon for toast notification
 * @param {string} type - Toast type
 * @returns {string} Font Awesome icon class
 */
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

/**
 * Get color for toast notification
 * @param {string} type - Toast type
 * @returns {string} CSS color value
 */
function getToastColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get URL parameter value
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Scroll to element smoothly
 * @param {string} elementId - ID of element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Check if image URL is valid
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} True if image loads successfully
 */
function isValidImageURL(url) {
    return new Promise((resolve) => {
        if (!url || url.trim() === '') {
            resolve(false);
            return;
        }
        
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(false), 10000);
    });
}

/**
 * Initialize common page functionality
 */
function initializePage() {
    // Add loading state to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                submitButton.disabled = true;
                
                // Re-enable after form submission
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    });
    
    // Add focus effects to input fields
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .input-group.focused {
        transform: translateY(-2px);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Initialize page when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Export functions for use in other scripts
window.RakshaBandhanApp = {
    loadSistersData,
    checkSisterExists,
    getSisterData,
    validateSisterData,
    sanitizeHTML,
    formatText,
    showToast,
    copyToClipboard,
    isValidImageURL,
    getURLParameter,
    scrollToElement,
    formatDate
};
