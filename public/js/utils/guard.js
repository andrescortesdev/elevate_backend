// ========================================
// GUARD.JS - Session Control and Access
// ========================================

/**
 * Checks if there's an active session in LocalStorage
 * @returns {boolean} true if there's an active session
 */
export function isLoggedIn() {
    return !!localStorage.getItem("currentUser");
}

/**
 * Gets logged user data
 * @returns {Object|null} User data or null if no session
 */
export function getUser() {
    try {
        const userData = localStorage.getItem("currentUser");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
}

/**
 * Saves user data in LocalStorage
 * @param {Object} userData - User data to save
 */
export function setUser(userData) {
    try {
        localStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

/**
 * Logs out the user
 */
export function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

/**
 * Redirects according to access rules for each page
 * @param {string} currentPage - Current page to apply rules
 */
export function guard(currentPage) {
    const logged = isLoggedIn();
    const user = getUser();


    // Save current page to redirect after login (only if NOT logged in)
    if (!logged && !currentPage.includes('loginPage.html')) {
        localStorage.setItem('returnUrl', currentPage);
    }

    // Pages that require authentication
    const protectedPages = [
        'vacanciesPage.html',
        'candidatesPage.html',
        'candidatePage.html',
        'aiCvPage.html'
    ];

    // If on a protected page and not logged in
    if (protectedPages.some(page => currentPage.includes(page)) && !logged) {
        window.location.href = "loginPage.html";
        return;
    }

    // If on login page and already logged in
    if (currentPage.includes('loginPage.html') && logged) {
        // Check if there's a saved previous page
        const returnUrl = localStorage.getItem('returnUrl') || 'vacanciesPage.html';
        localStorage.removeItem('returnUrl'); // Clean up after use
        window.location.href = returnUrl;
        return;
    }

}

/**
 * Protects a specific page requiring authentication
 * @param {string} redirectTo - URL to redirect to if not authenticated
 */
export function requireAuth(redirectTo = "login.html") {
    if (!isLoggedIn()) {
        window.location.href = redirectTo;
    }
}

/**
 * Applies guard automatically based on current URL
 */
export function autoGuard() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    guard(currentPage);
}

/**
 * Initializes the authentication system
 */
export function initAuth() {
    // Apply automatic guard
    autoGuard();

    // Expose logout functions globally for navbar use
    window.AuthGuard = {
        logout,
        isLoggedIn,
        getUser,
        requireAuth
    };
}
