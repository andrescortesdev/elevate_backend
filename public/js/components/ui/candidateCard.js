/**
 * Candidate Card component for displaying candidate information
 * Provides consistent candidate display across candidatesPage and vacanciePage
 */


/**
 * Create candidate card element for candidates list view
 * @param {Object} candidate - Candidate data
 * @param {Array} applications - All applications for stats
 * @returns {HTMLElement} Card element
 */
export function createCandidateCard(candidate, applications = []) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';

    // Parse skills and languages
    let skills = [];
    let languages = [];
    try {
        skills = Array.isArray(candidate.skills) ? candidate.skills : JSON.parse(candidate.skills || '[]');
        languages = Array.isArray(candidate.languages) ? candidate.languages : JSON.parse(candidate.languages || '[]');
    } catch (error) {
        console.warn('Error parsing skills/languages for candidate:', candidate.candidate_id);
    }

    // Get candidate applications count
    const candidateApplications = applications.filter(app => app.candidate_id === candidate.candidate_id);
    const applicationCount = candidateApplications.length;

    // Generate initials for avatar
    const initials = candidate.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();

    div.innerHTML = `
        <div class="flex items-center gap-6">
            <!-- Avatar -->
            <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span class="text-white font-bold text-sm">${initials}</span>
                </div>
            </div>
            
            <!-- Main information -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 truncate">${candidate.name}</h3>
                        <p class="text-sm text-blue-600 font-medium">${candidate.occupation}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${applicationCount} aplicacion${applicationCount !== 1 ? 'es' : ''}
                        </span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${candidate.summary || 'No summary available'}</p>
                
                <!-- Skills and Languages -->
                <div class="flex flex-wrap gap-2 mb-3">
                    ${skills.slice(0, 3).map(skill =>
        `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">${skill}</span>`
    ).join('')}
                    ${skills.length > 3 ? `<span class="text-xs text-gray-500">+${skills.length - 3} mas</span>` : ''}
                </div>
                
                <!-- Additional information -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128ZM176,80a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h16A8,8,0,0,1,176,80Zm56,48a8,8,0,0,1-8,8H208a8,8,0,0,1,0-16h16A8,8,0,0,1,232,128Z"/>
                        </svg>
                        ${candidate.email}
                    </span>
                    ${languages.length > 0 ? `
                        <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24a8,8,0,0,0-8,8V48a8,8,0,0,0,16,0V32A8,8,0,0,0,176,24Z"/>
                            </svg>
                            ${languages.slice(0, 2).map(lang => typeof lang === 'string' ? lang : lang.language).join(', ')}
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <!-- Action button -->
            <div class="flex-shrink-0">
                <button 
                    class="view-candidate-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    data-candidate-id="${candidate.candidate_id}"
                    title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128A133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    return div;
}

/**
 * Create candidate card element for vacancy applications view  
 * @param {Object} candidate - Candidate data
 * @param {Object} application - Application data
 * @param {Function} onStatusChange - Callback for status change
 * @returns {HTMLElement} Card element
 */
export function createApplicationCandidateCard(candidate, application, onStatusChange) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';

    const initials = candidate.name.split(' ').map(name => name.charAt(0)).join('').substring(0, 2);
    const statusConfig = getApplicationStatusConfig(application.status);
    const applicationDate = new Date(application.application_date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    div.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Candidate Info -->
            <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="text-white font-bold text-sm">${initials}</span>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3">
                        <h3 class="font-semibold text-gray-900 truncate">${candidate.name}</h3>
                        <a href="candidatePage.html?id=${candidate.candidate_id}" 
                           class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 group">
                            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Ver Perfil
                        </a>
                    </div>
                    <p class="text-sm text-gray-600 truncate">${candidate.occupation}</p>
                    <p class="text-xs text-gray-500">${candidate.email}</p>
                </div>
            </div>

            <!-- Status and Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="flex flex-col items-start sm:items-end gap-1">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}">
                        ${statusConfig.label}
                    </span>
                    <span class="text-xs text-gray-500">Applied: ${applicationDate}</span>
                </div>
                
                <!-- Status Change Button -->
                <div class="relative">
                    <button type="button" data-application-id="${application.application_id}" 
                            class="status-change-btn flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                        Cambiar Estado
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    return div;
}

/**
 * Get application status configuration
 * @param {string} status - Application status
 * @returns {Object} Status configuration
 */
function getApplicationStatusConfig(status) {
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
 * Initialize candidate card event listeners
 * @param {HTMLElement} container - Container with candidate cards
 * @param {Function} onViewCandidate - Callback for view candidate action
 */
export function initializeCandidateCards(container, onViewCandidate) {
    if (!container) return;

    container.addEventListener('click', (event) => {
        const viewButton = event.target.closest('.view-candidate-btn');
        if (viewButton) {
            const candidateId = viewButton.dataset.candidateId;
            if (onViewCandidate && candidateId) {
                onViewCandidate(candidateId);
            }
        }
    });
}