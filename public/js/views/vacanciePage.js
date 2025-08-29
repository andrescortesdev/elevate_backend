import { guard } from '../utils/guard.js';
import { getVacancies, getApplicationsByVacancyIdController } from '../api/vacancies.js';
import { getCandidates } from '../api/candidates.js';
import { getApplications, updateApplication, getAllApplicationsColumn } from '../api/applications.js';
import { renderNavbar } from '../components/ui/navbar.js';
import { showSuccess, showError } from '../components/ui/messageToast.js';
import { updatePagination } from '../components/ui/pagination.js';

// Global state
let vacancy = null;
let candidates = [];
let applications = [];
let filteredApplications = [];
let applicationJoin = [];
let applicationsColumn = [];
let currentFilters = {
    search: '',
    status: ''
};
let currentPage = 1;
const itemsPerPage = 5;

// Modal state
let pendingStatusChange = {
    applicationId: null,
    newStatus: null,
    candidateName: null,
    currentStatus: null
};

/**
 * Get URL parameters
 */
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id'))
    };
}

/**
 * Load vacancy and candidates data
 */
async function loadVacancyData() {
    try {
        const params = getURLParams();

        if (!params.id) {
            showVacancyNotFound();
            return;
        }

        // Load data in parallel
        const [vacanciesData, candidatesData, applicationsData, applicationJoinData, applicationsColumnData] = await Promise.all([
            getVacancies(),
            getCandidates(),
            getApplications(),
            getApplicationsByVacancyIdController(params.id),
            getAllApplicationsColumn()
        ]);
        applicationJoin = applicationJoinData;
        applicationsColumn = applicationsColumnData

        // Find specific vacancy
        vacancy = vacanciesData.find(v => v.vacancy_id === params.id);

        if (!vacancy) {
            showVacancyNotFound();
            return;
        }

        candidates = candidatesData;
        applications = applicationsData;




        // Filter applications for this vacancy   
        filteredApplications = applicationsColumn.filter(app => app.vacancy_id === params.id);


        renderVacancy();
        renderStats();
        renderCandidates();
        hideLoading();

    } catch (error) {
        console.error('Error loading vacancy data:', error);
        showError('Error loading vacancy information');
    }
}

/**
 * Render vacancy information
 */
function renderVacancy() {
    // Initials for vacancy icon
    const initials = vacancy.title.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    document.getElementById('vacancy-initials').textContent = initials;

    // Basic info
    document.getElementById('vacancy-title').textContent = vacancy.title;
    document.getElementById('vacancy-description').textContent = vacancy.description;
    document.getElementById('vacancy-salary').textContent = `$${vacancy.salary.toLocaleString()}`;
    document.getElementById('vacancy-id').textContent = vacancy.vacancy_id;

    // Format creation date
    const creationDate = new Date(vacancy.creation_date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('vacancy-date').textContent = creationDate;

    // Status badge
    const statusBadge = document.getElementById('vacancy-status');
    const statusConfig = getStatusConfig(vacancy.status);
    statusBadge.textContent = statusConfig.label;
    statusBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}`;
}

/**
 * Render candidate statistics
 */
function renderStats() {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter(app => app.status === 'pending').length;
    const interview = filteredApplications.filter(app => app.status === 'interview').length;
    const offered = filteredApplications.filter(app => app.status === 'offered').length;
    const accepted = filteredApplications.filter(app => app.status === 'accepted').length;
    const rejected = filteredApplications.filter(app => app.status === 'rejected').length;

    document.getElementById('total-applications').textContent = total;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-interview').textContent = interview;
    document.getElementById('stat-offered').textContent = offered;
    document.getElementById('stat-accepted').textContent = accepted;
    document.getElementById('stat-rejected').textContent = rejected;
}

/**
 * Render candidates list
 */
function renderCandidates() {
    const container = document.getElementById('candidates-container');
    container.innerHTML = '';

    // Apply filters
    let applicationsToShow = applyFilters(applicationJoin);

    if (applicationsToShow.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="mx-auto text-gray-300 mb-4">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                </svg>
                <p class="font-medium text-gray-600">No candidates found</p>
                <p class="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                <div class="mt-6 flex items-center justify-center">
                    <a href="aiCvPage.html" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Upload CVs
                    </a>
                </div>
            </div>
        `;
        updatePagination(1, 0, itemsPerPage, 'pagination-controls', (newPage) => {
            currentPage = newPage;
            renderCandidates();
        });
        return;
    }

    // Apply pagination
    const totalItems = applicationsToShow.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedApplications = applicationsToShow.slice(startIndex, endIndex);

    // Create card for each candidate
    paginatedApplications.forEach(application => {
        const candidate = application.Candidate;
        if (candidate) {
            const candidateCard = createCandidateCard(candidate, application);
            container.appendChild(candidateCard);
        }
    });

    // Update pagination
    updatePagination(currentPage, totalItems, itemsPerPage, 'pagination-controls', (newPage) => {
        currentPage = newPage;
        renderCandidates();
    });
}

/**
 * Create candidate card
 */
function createCandidateCard(candidate, application) {
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
                            Show profile
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
                        Change Status
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
 * Apply filters
 */
function applyFilters(applicationJoin) {
    return applicationJoin.filter(application => {
        const candidate = application.Candidate;
        if (!candidate) return false;

        // Search filter by name or email
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const nameMatch = (candidate.name ?? "").toLowerCase().includes(searchTerm);
            const emailMatch = (candidate.email ?? "").toLowerCase().includes(searchTerm);

            if (!nameMatch && !emailMatch) {
                return false;
            }
        }

        // Application status filter
        if (currentFilters.status && application.status !== currentFilters.status) {
            return false;
        }

        return true;
    });
}

/**
 * Show status change modal
 */
function showStatusChangeModal(applicationId) {

    const application = applicationJoin.find(app => app.application_id == applicationId); // Use == for type coercion

    if (!application) {
        console.error('Application not found with ID:', applicationId);
        showError('No se pudo encontrar la aplicación');
        return;
    }

    const candidate = candidates.find(c => c.candidate_id === application.candidate_id);
    if (!candidate) {
        console.error('Candidate not found with ID:', application.candidate_id);
        showError('No se pudo encontrar el candidato');
        return;
    }

    // Store pending change data (without newStatus since user will select it)
    pendingStatusChange = {
        applicationId: applicationId,
        newStatus: null,
        candidateName: candidate.name,
        currentStatus: application.status
    };

    // Update modal content
    document.getElementById('modal-candidate-name').textContent = candidate.name;

    // Current status
    const currentStatusConfig = getApplicationStatusConfig(application.status);
    const currentStatusElement = document.getElementById('modal-current-status');
    currentStatusElement.textContent = currentStatusConfig.label;
    currentStatusElement.className = `px-2 py-1 rounded-full text-xs font-medium ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor}`;

    // Configure select options - disable current status but keep it visible
    const statusSelect = document.getElementById('modal-status-select');
    const options = statusSelect.querySelectorAll('option');

    // Reset all options first
    options.forEach(option => {
        option.disabled = false;
        option.style.color = '';
        option.style.backgroundColor = '';
        // Clean any previous "(Estado Actual)" text
        if (option.textContent.includes(' (Estado Actual)')) {
            option.textContent = option.textContent.replace(' (Estado Actual)', '');
        }
    });

    // Find and disable the current status option
    const currentOption = statusSelect.querySelector(`option[value="${application.status}"]`);
    if (currentOption) {
        currentOption.disabled = true;
        currentOption.style.color = '#9CA3AF'; // text-gray-400
        currentOption.style.backgroundColor = '#F9FAFB'; // bg-gray-50
        currentOption.textContent = currentOption.textContent + ' (Estado Actual)';
    }

    // Set select to first available option (not current status)
    const availableOptions = Array.from(options).filter(opt => !opt.disabled);
    if (availableOptions.length > 0) {
        statusSelect.value = availableOptions[0].value;
    } else {
        // Fallback if no options available
        statusSelect.selectedIndex = 0;
    }

    // Show modal
    document.getElementById('status-change-modal').classList.remove('hidden');
}

/**
 * Hide status change modal
 */
function hideStatusChangeModal() {
    // Clean up select options (remove "(Estado Actual)" text and reset states)
    const statusSelect = document.getElementById('modal-status-select');
    if (statusSelect) {
        const options = statusSelect.querySelectorAll('option');

        options.forEach(option => {
            option.disabled = false;
            option.style.color = '';
            option.style.backgroundColor = '';
            // Remove "(Estado Actual)" text if present
            if (option.textContent.includes(' (Estado Actual)')) {
                option.textContent = option.textContent.replace(' (Estado Actual)', '');
            }
        });
    }

    document.getElementById('status-change-modal').classList.add('hidden');
    pendingStatusChange = {
        applicationId: null,
        newStatus: null,
        candidateName: null,
        currentStatus: null
    };
}

/**
 * Update application status (after confirmation)
 */
async function updateApplicationStatus(applicationId, newStatus) {
    try {
        const application = applications.find(app => app.application_id == applicationId); // Use == for type coercion
        if (!application) return;

        // Update in API
        await updateApplication(applicationId, {
            ...application,
            status: newStatus
        });

        // Reload all data to ensure consistency - this will also re-render everything
        await loadVacancyData();

        showSuccess(`Estado actualizado a ${getApplicationStatusConfig(newStatus).label}`);

    } catch (error) {
        console.error('Error updating application status:', error);
        showError('Error al actualizar el estado de la aplicación');
    }
}

/**
 * Vacancy status configuration
 */
function getStatusConfig(status) {
    const configs = {
        'open': {
            label: 'Open',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-800'
        },
        'closed': {
            label: 'Closed',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800'
        },
        'paused': {
            label: 'Paused',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        }
    };
    return configs[status] || configs['open'];
}

/**
 * Application status configuration
 */
function getApplicationStatusConfig(status) {
    const configs = {
        'pending': {
            label: 'Pending',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        },
        'interview': {
            label: 'Interview',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800'
        },
        'offered': {
            label: 'Offered',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800'
        },
        'accepted': {
            label: 'Accepted',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
        },
        'rejected': {
            label: 'Rejected',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800'
        }
    };
    return configs[status] || configs['pending'];
}

/**
 * Ocultar loading
 */
function hideLoading() {
    document.getElementById('loading-vacancy').classList.add('hidden');
    document.getElementById('vacancy-content').classList.remove('hidden');
}

/**
 * Show vacancy not found state
 */
function showVacancyNotFound() {
    document.getElementById('loading-vacancy').classList.add('hidden');
    document.getElementById('vacancy-content').classList.add('hidden');
    document.getElementById('vacancy-not-found').classList.remove('hidden');
}


/**
 * Setup filters
 */
function setupFilters() {
    const searchInput = document.getElementById('candidate-search');
    const statusFilter = document.getElementById('status-filter');

    // Search while typing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset page when filtering
            renderCandidates();
        });
    }

    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1; // Reset page when filtering
            renderCandidates();
        });
    }
}


/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Event delegation for status change buttons
    document.addEventListener('click', function (event) {
        // Handle status change button click (show modal)
        if (event.target.closest('.status-change-btn')) {
            const btn = event.target.closest('.status-change-btn');
            const applicationId = btn.dataset.applicationId;

            // Show modal for status change
            showStatusChangeModal(applicationId);
            return;
        }
    });

    // Modal event listeners
    setupModalEventListeners();
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners() {
    // Close modal buttons
    document.getElementById('close-modal')?.addEventListener('click', hideStatusChangeModal);
    document.getElementById('cancel-status-change')?.addEventListener('click', hideStatusChangeModal);

    // Confirm status change
    document.getElementById('confirm-status-change')?.addEventListener('click', async function () {
        const statusSelect = document.getElementById('modal-status-select');
        const newStatus = statusSelect.value;

        if (pendingStatusChange.applicationId && newStatus) {
            await updateApplicationStatus(pendingStatusChange.applicationId, newStatus);
            hideStatusChangeModal();
        } else {
            showError('Por favor selecciona un estado');
        }
    });

    // Close modal when clicking outside
    document.getElementById('status-change-modal')?.addEventListener('click', function (event) {
        if (event.target === this) {
            hideStatusChangeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !document.getElementById('status-change-modal').classList.contains('hidden')) {
            hideStatusChangeModal();
        }
    });
}

/**
 * Initialization when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {

    // Render navbar component
    renderNavbar('navbar-container', 'vacancies');

    // Guard disabled - waiting for users endpoint
    const currentPage = window.location.pathname.split('/').pop();
    guard(currentPage);

    setupFilters();
    setupEventListeners();

    loadVacancyData();
});