import { guard } from '../utils/guard.js';
import { getCandidates } from '../api/candidates.js';
import { getApplications, getAllApplicationsColumn } from '../api/applications.js';
import { renderNavbar } from '../components/ui/navbar.js';
import { updatePagination } from '../components/ui/pagination.js';


// Global application status
let candidates = [];
let applications = [];
let applicationsColumn = [];
let currentFilters = {
    search: '',
    occupation: '',
    skill: ''
};
let currentPage = 1;
const itemsPerPage = 4;

/**
 * Load all candidates
 */
async function loadCandidates() {
    try {
        candidates = await getCandidates();
        applications = await getApplications();
        applicationsColumn = await getAllApplicationsColumn();


        renderCandidatesCards();
        updateStats();
        setupFilters();
    } catch (error) {
        console.error('Error loading candidates:', error);
        // Show error in console, the user will see that the data is not loaded
    }
}

/**
 * Configure filter options dynamically
 */
function setupFilters() {
    // Unique occupations
    const occupations = [...new Set(candidates.map(c => c.occupation))];
    const occupationFilter = document.getElementById('occupation-filter');
    if (occupationFilter) {
        occupationFilter.innerHTML = '<option value="">All occupations</option>';
        occupations.forEach(occupation => {
            const option = document.createElement('option');
            option.value = occupation;
            option.textContent = occupation;
            occupationFilter.appendChild(option);
        });
    }

    // Simple skills extraction
    const allSkills = candidates.flatMap(c => {
        const skills = Array.isArray(c.skills) ? c.skills : [];
        return skills.map(skill => typeof skill === 'string' ? skill : skill.name || 'Unknown');
    });
    const uniqueSkills = [...new Set(allSkills)];
    const skillDatalist = document.getElementById('skills-datalist');
    if (skillDatalist) {
        skillDatalist.innerHTML = '';
        uniqueSkills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            skillDatalist.appendChild(option);
        });
    }

}

/**
 * Rendering candidate cards
 */
function renderCandidatesCards() {
    const container = document.getElementById('candidates-container');
    if (!container) return;

    // Hide loading
    const loadingElement = document.getElementById('loading-candidates');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    container.innerHTML = '';

    // Apply filters
    let candidatesToShow = applyFilters(candidates);

    // Apply pagination
    const totalItems = candidatesToShow.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    candidatesToShow = candidatesToShow.slice(startIndex, endIndex);

    if (candidatesToShow.length === 0) {
        // Show no candidates message
        const hasActiveFilters = currentFilters.search || currentFilters.occupation || currentFilters.skill;
        const message = hasActiveFilters
            ? 'No hay candidatos que coincidan con los filtros aplicados'
            : 'No hay candidatos disponibles';

        container.innerHTML = `
            <div class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="text-gray-300">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z"/>
                    </svg>
                    <p class="font-medium text-gray-600">${message}</p>
                    <p class="text-sm text-gray-400">Intenta ajustar los filtros o revisar la conexion</p>
                </div>
            </div>
        `;
        return;
    }

    candidatesToShow.forEach(candidate => {
        const card = createCandidateCard(candidate);
        container.appendChild(card);
    });

    // Update pagination
    updatePagination(currentPage, totalItems, itemsPerPage, 'pagination-container', (newPage) => {
        currentPage = newPage;
        renderCandidatesCards();
    });
}

/**
 * Create candidate card
 */
function createCandidateCard(candidate) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';

    // Parse skills and languages safely
    let skills = [];
    let languages = [];
    try {
        // Handle both array and string formats
        skills = Array.isArray(candidate.skills) ? candidate.skills :
            (candidate.skills ? JSON.parse(candidate.skills) : []);
        languages = Array.isArray(candidate.languages) ? candidate.languages :
            (candidate.languages ? JSON.parse(candidate.languages) : []);
    } catch (error) {
        console.warn('Error parsing skills/languages for candidate:', candidate.candidate_id);
        skills = [];
        languages = [];
    }

    // Get applications from the candidate
    const candidateApplications = applicationsColumn.filter(app => app.candidate_id === candidate.candidate_id);
    const applicationCount = candidateApplications.length;

    // Generate Avatar Initials
    const initials = candidate.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();

    div.innerHTML = `
        <div class="flex items-center gap-6">
            <!-- Avatar -->
            <div class="flex-shrink-0">
                <a href="candidatePage.html?id=${candidate.candidate_id}" class="block w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200">
                    <span class="text-white font-bold text-sm">${initials}</span>
                </a>
            </div>
            
            <!-- Main information -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="text-lg font-bold truncate">
                            <a href="candidatePage.html?id=${candidate.candidate_id}" class="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                                ${candidate.name}
                            </a>
                        </h3>
                        <p class="text-sm text-blue-600 font-medium">${candidate.occupation}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${applicationCount} application${applicationCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${candidate.summary}</p>
                
                <!-- Skills and Languages -->
                <div class="flex flex-wrap gap-2 mb-3">
                    ${skills.slice(0, 3).map(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name || 'Unknown';
        return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">${skillName}</span>`;
    }).join('')}
                    ${skills.length > 3 ? `<span class="text-xs text-gray-500">+${skills.length - 3} more</span>` : ''}
                </div>
                
                <!-- Additional information -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128ZM176,80a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h16A8,8,0,0,1,176,80Zm56,48a8,8,0,0,1-8,8H208a8,8,0,0,1,0-16h16A8,8,0,0,1,232,128Z"/>
                        </svg>
                        ${candidate.email || 'Unavailable'}
                    </span>
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24a8,8,0,0,0-8,8V48a8,8,0,0,0,16,0V32A8,8,0,0,0,176,24Z"/>
                        </svg>
                        ${languages.slice(0, 2).map(lang => typeof lang === 'string' ? lang : lang.name || lang.language || 'Unknown').join(', ')}
                    </span>
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/>
                        </svg>
                        ${candidate.phone || 'Unavailable'}
                    </span>
                </div>
            </div>
            
            <!-- Action button -->
            <div class="flex-shrink-0">
                <button 
                    class="view-candidate-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    data-candidate-id="${candidate.candidate_id}"
                    title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Add event click only to view details button
    const viewButton = div.querySelector('.view-candidate-btn');
    if (viewButton) {
        viewButton.addEventListener('click', () => viewCandidate(candidate.candidate_id));
    }

    return div;
}

/**
 * Apply filters to candidates
 */
function applyFilters(candidatesList) {
    return candidatesList.filter(candidate => {
        // Search filter by text
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const nameMatch = (candidate.name ?? "").toLowerCase().includes(searchTerm);
            const emailMatch = (candidate.email ?? "").toLowerCase().includes(searchTerm);
            const phoneMatch = (candidate.phone ?? "").toLowerCase().includes(searchTerm);
            const occupationMatch = (candidate.occupation ?? "").toLowerCase().includes(searchTerm);

            if (!nameMatch && !emailMatch && !occupationMatch && !phoneMatch) {
                return false;
            }
        }

        // Filter by occupation
        if (currentFilters.occupation && candidate.occupation !== currentFilters.occupation) {
            return false;
        }

        // Filter by skill
        if (currentFilters.skill) {
            const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
            const skillNames = candidateSkills.map(skill => typeof skill === 'string' ? skill : skill.name || '');
            if (!skillNames.some(skill => skill.toLowerCase().includes(currentFilters.skill.toLowerCase()))) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Update statistics
 */
function updateStats() {
    const totalCandidates = candidates.length;

    const candidatesWithApps = candidates.filter(candidate =>
        applicationsColumn.some(app => app.candidate_id === candidate.candidate_id)
    ).length;

    const uniqueOccupations = [...new Set(candidates.map(c => c.occupation))].length;

    // Update Stat Cards
    const totalCard = document.getElementById('total-candidates');
    const withAppsCard = document.getElementById('candidates-with-apps');
    const occupationsCard = document.getElementById('unique-occupations');

    if (totalCard) totalCard.textContent = totalCandidates;
    if (withAppsCard) withAppsCard.textContent = candidatesWithApps;
    if (occupationsCard) occupationsCard.textContent = uniqueOccupations;
}

/**
 * View details of a candidate
 */
function viewCandidate(candidateId) {
    const candidate = candidates.find(c => c.candidate_id === candidateId);
    if (candidate) {
        window.location.href = `candidatePage.html?id=${candidateId}`;
    }
}

/**
 * Configure event listeners for filters
 */
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const occupationFilter = document.getElementById('occupation-filter');
    const skillFilter = document.getElementById('skill-filter');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');

    // Search as you type
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset pagination when you change filter
            renderCandidatesCards();
        });
    }

    // Filter by occupation
    if (occupationFilter) {
        occupationFilter.addEventListener('change', (e) => {
            currentFilters.occupation = e.target.value;
            currentPage = 1;
            renderCandidatesCards();
        });
    }

    // Filter by skill (input supports typing)
    if (skillFilter) {
        skillFilter.addEventListener('input', (e) => {
            currentFilters.skill = e.target.value;
            currentPage = 1;
            renderCandidatesCards();
        });
    }

    // Button apply filters
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            renderCandidatesCards();
        });
    }

    // Button to clear filters
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Clean filters
            currentFilters.search = '';
            currentFilters.occupation = '';
            currentFilters.skill = '';
            currentPage = 1;

            // Clean UI fields
            if (searchInput) searchInput.value = '';
            if (occupationFilter) occupationFilter.value = '';
            if (skillFilter) skillFilter.value = '';

            // Render without filters
            renderCandidatesCards();
        });
    }
}

// Expose function globally for buttons
window.viewCandidate = viewCandidate;

/**
 * Initialization when the DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'candidates.html';

    // Run guard to protect the page (DISABLED - waiting for users endpoint)
    guard(currentPage);

    // Render navbar component
    renderNavbar('navbar-container', 'candidates');

    // Load Leads at Startup
    loadCandidates();

    // Configure event listeners
    setupEventListeners();
});