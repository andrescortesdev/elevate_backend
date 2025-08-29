/**
 * Message Toast component for displaying notifications
 * Provides consistent success, error, and info messages across all pages
 */

/**
 * Show success message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export function showSuccess(message, duration = 4000) {
    showMessage(message, 'success', duration);
}

/**
 * Show error message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export function showError(message, duration = 4000) {
    showMessage(message, 'error', duration);
}

/**
 * Show info message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export function showInfo(message, duration = 4000) {
    showMessage(message, 'info', duration);
}

/**
 * Show general message with specified type
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'success', 'error', 'info'
 * @param {number} duration - Duration in milliseconds
 */
export function showMessage(message, type = 'info', duration = 4000) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

    // Apply type-specific styles
    const typeStyles = getTypeStyles(type);
    messageDiv.className += ` ${typeStyles.classes}`;

    // Add icon and message content
    messageDiv.innerHTML = `
        <div class="flex items-center gap-3">
            ${typeStyles.icon}
            <span class="font-medium">${message}</span>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(messageDiv);

    // Animate entrance
    setTimeout(() => {
        messageDiv.classList.remove('translate-x-full');
    }, 100);

    // Remove after specified duration
    setTimeout(() => {
        messageDiv.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, duration);
}

/**
 * Get styles and icon for message type
 * @param {string} type - Message type
 * @returns {Object} Style configuration
 */
function getTypeStyles(type) {
    const styles = {
        success: {
            classes: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
            icon: `
                <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `
        },
        error: {
            classes: 'bg-red-50 border border-red-200 text-red-700',
            icon: `
                <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            `
        },
        info: {
            classes: 'bg-blue-50 border border-blue-200 text-blue-700',
            icon: `
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `
        },
        warning: {
            classes: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
            icon: `
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            `
        }
    };

    return styles[type] || styles.info;
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Callback for confirm action
 * @param {Function} onCancel - Callback for cancel action (optional)
 * @returns {void}
 */
export function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    
    dialog.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end gap-3">
                <button id="confirm-cancel" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button id="confirm-ok" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Confirmar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    // Handle confirm
    dialog.querySelector('#confirm-ok').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (onConfirm) onConfirm();
    });

    // Handle cancel
    dialog.querySelector('#confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (onCancel) onCancel();
    });

    // Close on background click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
            if (onCancel) onCancel();
        }
    });
}