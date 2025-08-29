/**
 * Pagination component for handling page navigation
 */

/**
 * Update pagination display with stats and controls
 * @param {number} currentPage - Current page number
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 * @param {string} controlsContainerId - Container ID for pagination controls
 * @param {Function} onPageChange - Callback for page changes
 */
export function updatePagination(currentPage, totalItems, itemsPerPage, controlsContainerId, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    updatePaginationStats(currentPage, totalItems, itemsPerPage);
    updatePaginationControls(currentPage, totalPages, controlsContainerId, onPageChange);
}

/**
 * Update pagination statistics text
 * @param {number} currentPage - Current page number
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 */
export function updatePaginationStats(currentPage, totalItems, itemsPerPage) {
    const paginationStart = document.getElementById('pagination-start');
    const paginationEnd = document.getElementById('pagination-end');
    const paginationTotal = document.getElementById('pagination-total');

    const startItem = totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (paginationStart) paginationStart.textContent = startItem.toString();
    if (paginationEnd) paginationEnd.textContent = endItem.toString();
    if (paginationTotal) paginationTotal.textContent = totalItems.toString();
}

/**
 * Update pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} containerId - Container ID for pagination controls
 * @param {Function} onPageChange - Callback for page changes
 */
export function updatePaginationControls(currentPage, totalPages, containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = createPaginationButton('Previous', currentPage === 1, () => {
        if (currentPage > 1 && onPageChange) {
            onPageChange(currentPage - 1);
        }
    });
    container.appendChild(prevButton);

    // Page buttons
    const pageButtons = generatePageButtons(currentPage, totalPages);
    pageButtons.forEach(buttonConfig => {
        const button = createPageButton(buttonConfig, onPageChange);
        container.appendChild(button);
    });

    // Next button
    const nextButton = createPaginationButton('Next', currentPage === totalPages, () => {
        if (currentPage < totalPages && onPageChange) {
            onPageChange(currentPage + 1);
        }
    });
    container.appendChild(nextButton);

    // Add page jumper for large page counts
    if (totalPages > 15) {
        addPageJumper(container.parentElement, currentPage, totalPages, onPageChange);
    }
}

/**
 * Create standard pagination button
 * @param {string} text - Button text
 * @param {boolean} disabled - Whether button is disabled
 * @param {Function} clickHandler - Click handler function
 * @returns {HTMLElement} Button element
 */
export function createPaginationButton(text, disabled, clickHandler) {
    const button = document.createElement('button');
    button.className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${disabled
        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        }`;
    button.textContent = text;
    button.disabled = disabled;

    if (!disabled && clickHandler) {
        button.addEventListener('click', clickHandler);
    }

    return button;
}

/**
 * Generate page button configurations
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @returns {Array} Button configurations
 */
export function generatePageButtons(current, total) {
    const buttons = [];

    if (total <= 7) {
        // Show all pages (1-7)
        for (let i = 1; i <= total; i++) {
            buttons.push({ page: i, text: i.toString(), active: i === current });
        }
    } else if (total <= 15) {
        // Simple pagination with context (8-15 pages)
        if (current <= 4) {
            // Start: 1 2 3 4 5 ... 15
            for (let i = 1; i <= 5; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        } else if (current >= total - 3) {
            // End: 1 ... 11 12 13 14 15
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = total - 4; i <= total; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
        } else {
            // Middle: 1 ... 6 7 8 ... 15
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = current - 1; i <= current + 1; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        }
    } else {
        // Full pagination for 16+ pages
        if (current <= 4) {
            // Start: 1 2 3 4 5 ... 50
            for (let i = 1; i <= 5; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        } else if (current >= total - 3) {
            // End: 1 ... 46 47 48 49 50
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = total - 4; i <= total; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
        } else {
            // Middle: 1 ... 4 5 6 7 8 ... 50
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = current - 2; i <= current + 2; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        }
    }

    return buttons;
}

/**
 * Create individual page button
 * @param {Object} config - Button configuration
 * @param {Function} onPageChange - Page change callback
 * @returns {HTMLElement} Button element
 */
export function createPageButton(config, onPageChange) {
    const button = document.createElement('button');

    if (config.page === null) {
        // Ellipsis button
        button.className = 'px-4 py-2 text-sm font-medium text-gray-400 cursor-default';
        button.textContent = config.text;
        button.disabled = true;
    } else {
        // Normal page button
        button.className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${config.active
            ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`;
        button.textContent = config.text;

        if (!config.active && onPageChange) {
            button.addEventListener('click', () => {
                onPageChange(config.page);
            });
        }
    }

    return button;
}

/**
 * Add page jumper input for direct navigation
 * @param {HTMLElement} paginationSection - Pagination section element
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Page change callback
 */
export function addPageJumper(paginationSection, currentPage, totalPages, onPageChange) {
    if (!paginationSection) return;

    // Check if jumper already exists
    let jumperContainer = paginationSection.querySelector('.page-jumper');

    if (!jumperContainer) {
        jumperContainer = document.createElement('div');
        jumperContainer.className = 'page-jumper flex items-center gap-2 text-sm text-gray-600 mt-2 sm:mt-0';
        jumperContainer.innerHTML = `
            <span>Ir a página:</span>
            <input type="number" min="1" max="${totalPages}" class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <span>de ${totalPages}</span>
        `;

        const input = jumperContainer.querySelector('input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const page = parseInt(input.value);
                if (page >= 1 && page <= totalPages && onPageChange) {
                    onPageChange(page);
                    input.value = '';
                }
            }
        });

        input.addEventListener('blur', () => {
            input.value = '';
        });

        paginationSection.appendChild(jumperContainer);
    } else {
        // Update existing jumper
        const input = jumperContainer.querySelector('input');
        input.max = totalPages;
        jumperContainer.querySelector('span:last-child').textContent = `de ${totalPages}`;
    }
}

/**
 * Create simple pagination component for smaller lists
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages  
 * @param {Function} onPageChange - Page change callback
 * @returns {string} Pagination HTML
 */
export function createSimplePagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    return `
        <div class="flex items-center justify-between mt-6">
            <button ${prevDisabled ? 'disabled' : ''} 
                    class="px-3 py-2 text-sm font-medium rounded-lg transition-colors ${prevDisabled
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        }"
                    data-page="${currentPage - 1}">
                Anterior
            </button>
            
            <span class="text-sm text-gray-500">
                Página ${currentPage} de ${totalPages}
            </span>
            
            <button ${nextDisabled ? 'disabled' : ''}
                    class="px-3 py-2 text-sm font-medium rounded-lg transition-colors ${nextDisabled
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        }"
                    data-page="${currentPage + 1}">
                Siguiente
            </button>
        </div>
    `;
}