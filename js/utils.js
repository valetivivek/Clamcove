/**
 * Utils - Utility functions
 * Toast notifications, loading overlay, etc.
 */

/**
 * Show toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;

    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);

    // Also make it accessible via window for other modules
    return toast;
}

/**
 * Show loading overlay
 */
export function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
}

// Make showToast available globally for Stats module
window.showToast = showToast;

