import { guard } from '../utils/guard.js';
import { getVacancies, createVacancy as createVacancyAPI, updateVacancy as updateVacancyAPI, deleteVacancy as deleteVacancyAPI, getAllVacanciesWithCount } from '../api/vacancies.js';
import { getApplications } from '../api/applications.js';
import { renderNavbar } from '../components/ui/navbar.js';
import { showSuccess, showError } from '../components/ui/messageToast.js';
import { updatePagination } from '../components/ui/pagination.js';
import { getVacancyStatusConfig } from '../components/ui/statusBadge.js';

// Global application state
let vacancies = [];
let applications = [];
let currentEditingId = null;
let currentTab = 'all';
let currentVacancyToDelete = null;
let currentFilters = {
    search: '',
    status: ''
};
let currentPage = 1;
const itemsPerPage = 5;

/**
 * Load all vacancies
 */
async function loadVacancies() {
    try {
        vacancies = await getAllVacanciesWithCount();
        applications = await getApplications();

        renderVacanciesTable();
        updateStats();
    } catch (error) {
        console.error('Error loading vacancies:', error);
        showError('Error loading vacancies. Verify that the server is connected.');
    }
}

/**
 * Render vacancies table
 */
function renderVacanciesTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Apply filters
    let vacanciesToShow = applyFilters(vacancies);

    // Filter vacancies according to current tab
    if (currentTab !== 'all') {
        vacanciesToShow = vacanciesToShow.filter(v => v.status === currentTab);
    }

    // Apply pagination
    const totalItems = vacanciesToShow.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    vacanciesToShow = vacanciesToShow.slice(startIndex, endIndex);

    if (vacanciesToShow.length === 0) {
        // Determining the appropriate message
        let message = 'There are no vacancies available.';

        // If there are active filters, show specific message
        const hasActiveFilters = currentFilters.search || currentFilters.status;
        const hasActiveTab = currentTab !== 'all';

        if (hasActiveFilters || hasActiveTab) {
            if (hasActiveFilters && hasActiveTab) {
                message = `There are no vacancies that match the filters and selected tab.`;
            } else if (hasActiveFilters) {
                message = `There are no vacancies that match the applied filters.`;
            } else if (hasActiveTab) {
                const tabLabels = {
                    'open': 'open',
                    'closed': 'closed',
                    'paused': 'paused'
                };
                message = `There are no vacancies ${tabLabels[currentTab] || currentTab}`;
            }
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                    <div class="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="text-gray-300">
                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                        </svg>
                        <p class="font-medium text-gray-600">${message}</p>
                        <p class="text-sm text-gray-400">Try adjusting the filters or creating a new vacancy.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    vacanciesToShow.forEach(vacancy => {
        const row = createVacancyRow(vacancy);
        tbody.appendChild(row);
    });

    // Update pagination
    updatePagination(currentPage, totalItems, itemsPerPage, 'pagination-container', (newPage) => {
        currentPage = newPage;
        renderVacanciesTable();
    });
}

/**
 * Create vacancy row
 */
function createVacancyRow(vacancy) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors';

    const statusConfig = getVacancyStatusConfig(vacancy.status);
    const safeTitle = vacancy.title || 'Without title';
    const initials = safeTitle.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();

    // Count applications for this vacancy 
    const vacancyApplications = applications.filter(app => app.vacancy_id === vacancy.vacancy_id).length;


    tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <a href="vacanciePage.html?id=${vacancy.vacancy_id}" class="block h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200">
                        <span class="text-white font-bold text-sm">${initials}</span>
                    </a>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-bold">
                        <a href="vacanciePage.html?id=${vacancy.vacancy_id}" class="text-gray-900 hover:text-blue-600 transition-colors duration-200">${vacancy.title}</a>
                    </div>
                    <div class="text-sm text-gray-500">${vacancy.description ? `${vacancy.description.substring(0, 50)}${vacancy.description.length > 50 ? '...' : ''}` : 'No description'}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}">
                <div class="w-2 h-2 ${statusConfig.dotColor} rounded-full mr-2"></div>
                ${statusConfig.label}
            </span>
        </td>
        <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <span class="text-2xl font-bold text-blue-600">${vacancy.applicationsCount}</span>
                <span class="text-sm text-gray-500 ml-2">Candidates</span>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
            ${vacancy.salary != null ? Number(vacancy.salary).toLocaleString() : 'No salary specified'}
        </td>
        <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(vacancy.creation_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center space-x-2">
                <button data-edit-id="${vacancy.vacancy_id}" class="edit-vacancy-btn text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120Z"/>
                    </svg>
                </button>
                <button data-view-id="${vacancy.vacancy_id}" class="view-vacancy-btn text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all" title="Ver">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128A133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                    </svg>
                </button>
                <button data-delete-id="${vacancy.vacancy_id}" class="delete-vacancy-btn text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                    </svg>
                </button>
            </div>
        </td>
    `;

    return tr;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Apply filters to vacancies
 */
function applyFilters(vacanciesList) {
    return vacanciesList.filter(vacancy => {
        // Text search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const titleMatch = vacancy.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = vacancy.description.toLowerCase().includes(searchTerm);

            if (!titleMatch && !descriptionMatch) {
                return false;
            }
        }

        // Filter by Status
        if (currentFilters.status && vacancy.status !== currentFilters.status) {
            return false;
        }

        return true;
    });
}

/**
 * Update statistics
 */
function updateStats() {
    const totalVacancies = vacancies.length;
    const openVacancies = vacancies.filter(v => v.status === 'open').length;
    const closedVacancies = vacancies.filter(v => v.status === 'closed').length;
    const pausedVacancies = vacancies.filter(v => v.status === 'paused').length;

    // Update statistics cards
    const totalCard = document.getElementById('total-vacancies');
    const openCard = document.getElementById('open-vacancies');
    const applicationsCard = document.getElementById('total-applications');

    if (totalCard) totalCard.textContent = totalVacancies;
    if (openCard) openCard.textContent = openVacancies;
    if (applicationsCard) applicationsCard.textContent = applications.length;

    // Update tab counters
    const tabAllCount = document.getElementById('tab-all-count');
    const tabOpenCount = document.getElementById('tab-open-count');
    const tabClosedCount = document.getElementById('tab-closed-count');
    const tabPausedCount = document.getElementById('tab-paused-count');

    if (tabAllCount) tabAllCount.textContent = totalVacancies;
    if (tabOpenCount) tabOpenCount.textContent = openVacancies;
    if (tabClosedCount) tabClosedCount.textContent = closedVacancies;
    if (tabPausedCount) tabPausedCount.textContent = pausedVacancies;
}


/**
 * Show tab (simple function)
 */
function showTab(tab, element) {
    currentTab = tab;
    currentPage = 1; // Reset pagination when switching tabs

    // Remove active from all tabs
    document.querySelectorAll('#tab-all, #tab-open, #tab-closed, #tab-paused').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600', 'font-bold');
        btn.classList.add('border-transparent', 'text-gray-500');
    });

    // Add active to clicked tab
    element.classList.remove('border-transparent', 'text-gray-500');
    element.classList.add('border-blue-600', 'text-blue-600', 'font-bold');

    // Render filtered table
    renderVacanciesTable();
}

/**
 * Create new vacancy
 */
async function createVacancy(vacancyData) {
    try {
        const newVacancy = await createVacancyAPI(vacancyData);

        // Reload all vacancies instead of trusting the response
        await loadVacancies();
        showSuccess('Vacancy successfully created');
        return newVacancy;
    } catch (error) {
        console.error('Error creating vacancy:', error);
        showError('Error creating the vacancy');
        throw error;
    }
}

/**
 * Update existing vacancy
 */
async function updateVacancy(id, vacancyData) {
    try {
        const updatedVacancy = await updateVacancyAPI(id, vacancyData);
        
        // Reload all vacancies to ensure data consistency
        await loadVacancies();
        showSuccess('Vacancy successfully updated');
        return updatedVacancy;
    } catch (error) {
        console.error('Error updating vacancy:', error);
        showError('Error updating vacancy');
        throw error;
    }
}

/**
 * Delete vacancy
 */
async function deleteVacancy(id) {
    try {
        await deleteVacancyAPI(id);
        vacancies = vacancies.filter(v => v.vacancy_id !== id);
        renderVacanciesTable();
        updateStats();
        showSuccess('Vacancy successfully deleted');
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        showError('Error deleting vacancy');
        throw error;
    }
}

/**
 * Open modal to create new vacancy
 */
function openCreateModal() {
    currentEditingId = null;
    const modal = document.getElementById('vacancyModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = modal.querySelector('form');

    modalTitle.textContent = 'New Vacancy';
    form.reset();
    modal.classList.remove('hidden');
}

/**
 * Open modal to edit existing vacancy
 */
function openEditModal(vacancyId) {
    const vacancy = vacancies.find(v => v.vacancy_id === vacancyId);
    if (!vacancy) return;

    currentEditingId = vacancyId;
    const modal = document.getElementById('vacancyModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = modal.querySelector('form');

    modalTitle.textContent = 'Edit Vacancy';

    // Fill form with existing data
    form.querySelector('input[placeholder*="Senior Software Engineer"]').value = vacancy.title;
    form.querySelector('input[placeholder*="80000"]').value = vacancy.salary;
    form.querySelector('textarea[placeholder*="main responsibilities"]').value = vacancy.description;
    
    // Set current status in select
    const statusSelect = document.getElementById('vacancy-status-select');
    if (statusSelect) {
        statusSelect.value = vacancy.status;
    }

    modal.classList.remove('hidden');
}

/**
 * Close vacancy modal
 */
function closeModal() {
    const modal = document.getElementById('vacancyModal');
    modal.classList.add('hidden');
    currentEditingId = null;
}

/**
 * View vacancy details
 */
function viewVacancy(vacancyId) {
    // Redirect to vacancy detail page
    window.location.href = `vacanciePage.html?id=${vacancyId}`;
}

/**
 * Confirm vacancy deletion
 */
function confirmDelete(vacancyId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden');
    currentVacancyToDelete = vacancyId;
}

/**
 * Close deletion modal
 */
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.add('hidden');
    currentVacancyToDelete = null;
}

/**
 * Delete confirmed vacancy
 */
async function deleteConfirmed() {
    const vacancyId = currentVacancyToDelete;
    if (vacancyId) {
        try {
            await deleteVacancy(vacancyId);
            closeDeleteModal();
        } catch (error) {
            // Error already handled in deleteVacancy
        }
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const vacancyData = {
        title: form.querySelector('input[placeholder*="Senior Software Engineer"]').value.trim(),
        description: form.querySelector('textarea[placeholder*="main responsibilities"]').value.trim(),
        salary: parseFloat(form.querySelector('input[placeholder*="80000"]').value) || 0,
        status: document.getElementById('vacancy-status-select')?.value || 'open',
        creation_date: new Date()
    };


    // Basic Validation
    if (!vacancyData.title || !vacancyData.description) {
        showError('Please complete all required fields.');
        return;
    }

    if (vacancyData.salary > 99999999) {
        showError('The salary cannot exceed $99,999,999.');
        return;
    }

    if (currentEditingId) {
        // Update existing vacancy
        vacancyData.vacancy_id = currentEditingId;
        await updateVacancy(currentEditingId, vacancyData);
    } else {
        // Create new vacancy
        await createVacancy(vacancyData);
    }

    closeModal();
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'vacanciesPage.html';

    // Execute guard to protect page (DISABLED - waiting for users endpoint)
    guard(currentPage);


    // Render navbar component
    renderNavbar('navbar-container', 'vacancies');

    // Load vacancies on start
    loadVacancies();

    // Setup form
    const form = document.querySelector('#vacancyModal form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Setup filters
    setupFilters();

    // Setup all event listeners
    setupEventListeners();
});

/**
 * Setup event listeners for filters
 */
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');

    // Search as you type
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset pagination cuando cambia filtro
            renderVacanciesTable();
        });
    }

    // Filter by Status
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1; // Reset pagination when you change filter
            renderVacanciesTable();
        });
    }

    // Apply filters button (already applied automatically, but for consistency)
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            renderVacanciesTable();
        });
    }

    // Clear filters button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Clear filters
            currentFilters.search = '';
            currentFilters.status = '';
            currentPage = 1; // Reset pagination when filters are cleared

            // Clean UI fields
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';

            // Render table without filters
            renderVacanciesTable();
        });
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Create vacancy button
    const createBtn = document.getElementById('create-vacancy-btn');
    if (createBtn) {
        createBtn.addEventListener('click', openCreateModal);
    }

    // Filter tabs
    const tabAll = document.getElementById('tab-all');
    const tabOpen = document.getElementById('tab-open');
    const tabClosed = document.getElementById('tab-closed');
    const tabPaused = document.getElementById('tab-paused');

    if (tabAll) {
        tabAll.addEventListener('click', () => showTab('all', tabAll));
    }
    if (tabOpen) {
        tabOpen.addEventListener('click', () => showTab('open', tabOpen));
    }
    if (tabClosed) {
        tabClosed.addEventListener('click', () => showTab('closed', tabClosed));
    }
    if (tabPaused) {
        tabPaused.addEventListener('click', () => showTab('paused', tabPaused));
    }

    // Modal buttons
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }

    // Delete Modal Buttons
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteConfirmed);
    }

    // Event listeners for table action buttons (dynamically configured)
    document.addEventListener('click', function (event) {
        // Edit button
        if (event.target.closest('.edit-vacancy-btn')) {
            const btn = event.target.closest('.edit-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.editId);
            openEditModal(vacancyId);
        }

        // View button
        if (event.target.closest('.view-vacancy-btn')) {
            const btn = event.target.closest('.view-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.viewId);
            viewVacancy(vacancyId);
        }

        // Delete button
        if (event.target.closest('.delete-vacancy-btn')) {
            const btn = event.target.closest('.delete-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.deleteId);
            confirmDelete(vacancyId);
        }
    });
}