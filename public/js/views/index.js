// ========================================
// INDEX.JS - Minimum homepage logic
// ========================================

import { initAuth } from '../utils/guard.js';

/**
 * Initialize the homepage
 */
function initHomePage() {
    initAuth();
}

/**
 * Initialization when the DOM is ready
 */
function onDOMContentLoaded() {
    initHomePage();
}


// Run when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}