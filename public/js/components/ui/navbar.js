/**
 * Navbar component with integrated user dropdown functionality
 * Provides consistent header across all pages with navigation and user management
 */

/**
 * Generate navbar HTML with navigation and user dropdown
 * @param {string} activePage - Current active page identifier
 * @param {Object} options - Configuration options
 * @returns {string} Complete navbar HTML
 */
export function createNavbar(activePage = '', options = {}) {
    const {
        showNavigation = true,
        logoLink = '../index.html',
        logoText = 'TalentTrack'
    } = options;

    const navigationItems = [
        { id: 'vacancies', label: 'Vacancies', href: 'vacanciesPage.html' },
        { id: 'candidates', label: 'Candidates', href: 'candidatesPage.html' },
        { id: 'aiCv', label: 'Upload CVs', href: 'aiCvPage.html' }
    ];

    const navigationHTML = showNavigation ? navigationItems.map(item => {
        const isActive = activePage === item.id;
        const activeClasses = isActive 
            ? 'border-b-2 border-blue-100 pb-2 text-blue-100 font-bold px-3 py-2'
            : 'hover:text-blue-100 transition-colors px-3 py-2 rounded-lg hover:bg-white/10';
        
        return `<a class="${activeClasses}" href="${item.href}">${item.label}</a>`;
    }).join('') : '';

    return `
        <header class="flex items-center justify-between px-4 md:px-10 py-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-lg">
            <a href="${logoLink}" class="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                <div class="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-xl md:text-2xl font-bold tracking-wide">${logoText}</h2>
            </a>
            
            ${showNavigation ? `
                <nav class="hidden md:flex gap-8 text-base font-medium">
                    ${navigationHTML}
                </nav>
            ` : ''}
            
            <div class="flex items-center gap-4">
                <div class="relative">
                    <div id="user-avatar" class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <span id="user-initials" class="text-white font-bold text-sm">--</span>
                    </div>
                    
                    <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div class="px-4 py-3 border-b border-gray-200">
                            <p class="text-sm font-medium text-gray-900" id="user-name">Usuario</p>
                            <p class="text-xs text-gray-500" id="user-email">usuario@example.com</p>
                        </div>
                        <div class="py-1">
                            <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
}

/**
 * Initialize navbar functionality including user dropdown
 * Should be called after navbar HTML is inserted into DOM
 */
export function initializeNavbar() {
    setupUserDropdown();
}

/**
 * Setup user dropdown functionality
 * Handles avatar click, outside click, and logout
 */
function setupUserDropdown() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');

    if (!userAvatar || !userDropdown) {
        console.warn('Navbar: User dropdown elements not found');
        return;
    }

    // User dropdown toggle
    userAvatar.addEventListener('click', function () {
        userDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!userAvatar.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }
    });

    // Get logged user data from localStorage
    const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = loggedUser.name || 'Usuario';
    const userEmail = loggedUser.email || 'usuario@example.com';
    const initials = userName.split(' ').map(name => name.charAt(0)).join('').substring(0, 2).toUpperCase();

    // Update user interface
    const userInitialsElement = document.getElementById('user-initials');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');

    if (userInitialsElement) userInitialsElement.textContent = initials;
    if (userNameElement) userNameElement.textContent = userName;
    if (userEmailElement) userEmailElement.textContent = userEmail;

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Clear session data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('returnUrl');
            
            // Redirect to index
            window.location.href = '../index.html';
        });
    }
}

/**
 * Render navbar into specified container
 * @param {string} containerId - ID of container element
 * @param {string} activePage - Current active page identifier
 * @param {Object} options - Configuration options
 */
export function renderNavbar(containerId, activePage = '', options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Navbar: Container with ID '${containerId}' not found`);
        return;
    }

    container.innerHTML = createNavbar(activePage, options);
    initializeNavbar();
}