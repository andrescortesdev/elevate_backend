/**
 * Status Badge component for displaying consistent status indicators
 */

/**
 * Get vacancy status configuration
 * @param {string} status - Vacancy status
 * @returns {Object} Status configuration
 */
export function getVacancyStatusConfig(status) {
    const configs = {
        'open': {
            label: 'Open',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-800',
            dotColor: 'bg-emerald-400'
        },
        'closed': {
            label: 'Closed',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            dotColor: 'bg-gray-400'
        },
        'paused': {
            label: 'Paused',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            dotColor: 'bg-yellow-400'
        }
    };
    return configs[status] || configs['open'];
}

/**
 * Get application status configuration
 * @param {string} status - Application status
 * @returns {Object} Status configuration
 */
export function getApplicationStatusConfig(status) {
    const configs = {
        'pending': {
            label: 'Pendiente',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        },
        'interview': {
            label: 'Entrevista',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800'
        },
        'offered': {
            label: 'Ofrecido',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800'
        },
        'accepted': {
            label: 'Aceptado',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
        },
        'rejected': {
            label: 'Rechazado',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800'
        }
    };
    return configs[status] || configs['pending'];
}

/**
 * Create vacancy status badge
 * @param {string} status - Vacancy status
 * @param {boolean} includeDot - Whether to include status dot
 * @returns {string} Badge HTML
 */
export function createVacancyStatusBadge(status, includeDot = true) {
    const config = getVacancyStatusConfig(status);
    const dot = includeDot ? `<div class="w-2 h-2 ${config.dotColor} rounded-full mr-2"></div>` : '';

    return `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor}">
            ${dot}
            ${config.label}
        </span>
    `;
}

/**
 * Create application status badge
 * @param {string} status - Application status
 * @returns {string} Badge HTML
 */
export function createApplicationStatusBadge(status) {
    const config = getApplicationStatusConfig(status);

    return `
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}">
            ${config.label}
        </span>
    `;
}

/**
 * Update status badge element
 * @param {HTMLElement} element - Badge element to update
 * @param {string} status - New status
 * @param {string} type - Badge type: 'vacancy' or 'application'
 * @param {boolean} includeDot - Whether to include dot for vacancy badges
 */
export function updateStatusBadge(element, status, type = 'application', includeDot = false) {
    if (!element) return;

    let config;
    if (type === 'vacancy') {
        config = getVacancyStatusConfig(status);
        const dot = includeDot ? `<div class="w-2 h-2 ${config.dotColor} rounded-full mr-2"></div>` : '';
        element.innerHTML = `${dot}${config.label}`;
        element.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor}`;
    } else {
        config = getApplicationStatusConfig(status);
        element.textContent = config.label;
        element.className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`;
    }
}