import { guard } from '../utils/guard.js';
import { getCandidates, getCandidateNotes, updateCandidateNotes } from '../api/candidates.js';
import { getApplications } from '../api/applications.js'
import { renderNavbar } from '../components/ui/navbar.js';
import { getUser } from '../utils/guard.js';
import { showSuccess, showError } from '../components/ui/messageToast.js';

// Global state
let candidate = null;
let applications = [];
let currentEditingNoteId = null;

/**
 * Get URL parameters
 */
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')
    };
}

/**
 * Load specific candidate
 */
async function loadCandidate() {
    try {
        const params = getURLParams();

        if (!params.id) {
            showLoadingError('ID de candidato no proporcionado');
            return;
        }

        // Load candidate and applications
        const candidates = await getCandidates();
        applications = await getApplications();

        candidate = candidates.find(c => c.candidate_id == params.id);

        if (!candidate) {
            showLoadingError('Candidate not found');
            return;
        }

        renderCandidate();
        initializeNotes();
        hideLoading();

    } catch (error) {
        console.error('Error loading candidate:', error);
        showLoadingError('Error al cargar la informacion del candidato');
    }
}

/**
 * Render candidate information
 */
function renderCandidate() {
    // Profile section
    const initials = candidate.name.split(' ').map(name => name.charAt(0)).join('');
    document.getElementById('candidate-initials').textContent = initials;
    document.getElementById('candidate-name').textContent = candidate.name;
    document.getElementById('candidate-job').textContent = candidate.occupation;
    document.getElementById('candidate-email').textContent = candidate.email;
    document.getElementById('candidate-phone').textContent = candidate.phone;

    

    // Applications count (for reference but not displayed on this page)
    const candidateApplications = applications.filter(app => app.candidate_id === candidate.candidate_id);

    // Summary
    document.getElementById('candidate-summary').textContent = candidate.summary || 'No professional summary available';

    // Skills
    renderSkills();

    // Languages
    renderLanguages();

    // Experience
    renderExperience();

    // Education
    renderEducation();
}

/**
 * Render skills
 */
function renderSkills() {
    const skillsContainer = document.getElementById('candidate-skills');
    skillsContainer.innerHTML = '';

    try {
        const skills = candidate.skills || '[]';

        if (skills.length === 0) {
            skillsContainer.innerHTML = '<div class="text-gray-500 text-sm">No skills registered</div>';
            return;
        }

        skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium';
            skillElement.textContent = typeof skill === 'string' ? skill : skill.name || skill.skill || 'Unknown';
            skillsContainer.appendChild(skillElement);
        });
    } catch (error) {
        skillsContainer.innerHTML = '<div class="text-red-500 text-sm">Error loading skills</div>';
    }
}

/**
 * Render languages
 */
function renderLanguages() {
    const languagesContainer = document.getElementById('candidate-languages');
    languagesContainer.innerHTML = '';

    try {
        const languages = candidate.languages || '[]';

        if (languages.length === 0) {
            languagesContainer.innerHTML = '<div class="text-gray-500 text-sm">No languages registered</div>';
            return;
        }

        languages.forEach(language => {
            const languageElement = document.createElement('span');
            languageElement.className = 'bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium';
            languageElement.textContent = typeof language === 'string' ? language : 
                `${language.level || ''} ${language.language || language.name || 'Unknown'}`.trim();
            languagesContainer.appendChild(languageElement);
        });
    } catch (error) {
        languagesContainer.innerHTML = '<div class="text-red-500 text-sm">Error loading languages</div>';
    }
}

/**
 * Render Experience
 */
function renderExperience() {
    const experienceContainer = document.getElementById('candidate-experience');
    experienceContainer.innerHTML = '';

    try {
        const experience = candidate.experience || '[]';

        if (experience.length === 0) {
            experienceContainer.innerHTML = '<p class="text-gray-500">No hay experiencia registrada</p>';
            return;
        }

        experience.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50';

            // Handle both object and string formats
            let title = '';
            let description = '';
            let company = '';

            if (typeof exp === 'object' && exp !== null) {
                // Object format with company, position, description
                company = exp.company || 'Company not specified';
                title = exp.position || 'Position not specified';
                description = exp.description || '';
                if (exp.years) {
                    company += ` (${exp.years} year${exp.years > 1 ? 's' : ''})`;
                }
            } else {
                // Simple string format
                title = exp || 'Experience';
            }

            expElement.innerHTML = `
                <div>
                    ${company ? `<p class="font-semibold text-gray-900">${company}</p>` : ''}
                    <p class="font-medium text-blue-600">${title}</p>
                    ${description ? `<p class="text-gray-600 text-sm mt-1">${description}</p>` : ''}
                </div>
            `;
            experienceContainer.appendChild(expElement);
        });
    } catch (error) {
        experienceContainer.innerHTML = '<p class="text-red-500">Error al cargar experiencia</p>';
    }
}

/**
 * Render Education
 */
function renderEducation() {
    const educationContainer = document.getElementById('candidate-education');
    educationContainer.innerHTML = '';

    try {
        const education = candidate.education || '[]';


        if (education.length === 0) {
            educationContainer.innerHTML = '<p class="text-gray-500">No hay educacion registrada</p>';
            return;
        }

        education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50';
            eduElement.innerHTML = `
                <p class="font-semibold text-gray-900">${edu.degree}</p>
                <p class="font-medium text-blue-600">${edu.institution}</p>
                <p class="font-medium text-gray-900">${edu.years}</p>
            `;
            educationContainer.appendChild(eduElement);
        });
    } catch (error) {
        educationContainer.innerHTML = '<p class="text-red-500">Error al cargar educacion</p>';
    }
}

/**
 * Show error in loading area
 */
function showLoadingError(message) {
    const loadingElement = document.getElementById('loading-candidate');
    loadingElement.innerHTML = `
        <div class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <p class="font-medium text-red-600">${message}</p>
            <a href="candidatesPage.html" class="text-blue-600 hover:text-blue-800 underline text-sm">Back to Candidates</a>
        </div>
    `;
}

/**
 * Hide loading
 */
function hideLoading() {
    document.getElementById('loading-candidate').classList.add('hidden');
    document.getElementById('candidate-content').classList.remove('hidden');
}



/**
 * Initialize notes functionality
 */
async function initializeNotes() {
    const user = getUser();
    if (!user) {
        hideNotesSection();
        return;
    }
    
    // Load notes from database
    await loadAndRenderNotes();
    
    // Setup event listeners
    setupNotesEventListeners();
}

/**
 * Hide notes section if user not logged in
 */
function hideNotesSection() {
    const notesSection = document.querySelector('#personal-notes-section');
    if (notesSection) {
        notesSection.style.display = 'none';
    }
}

/**
 * Setup event listeners for notes functionality
 */
function setupNotesEventListeners() {
    // Add note button
    document.getElementById('add-note-btn')?.addEventListener('click', showNoteForm);
    
    // Save note button
    document.getElementById('save-note-btn')?.addEventListener('click', saveNote);
    
    // Cancel note button
    document.getElementById('cancel-note-btn')?.addEventListener('click', hideNoteForm);
    
    // Delete note modal buttons
    document.getElementById('cancel-delete-note-btn')?.addEventListener('click', closeDeleteNoteModal);
    document.getElementById('confirm-delete-note-btn')?.addEventListener('click', confirmDeleteNote);
}

/**
 * Show note form
 */
function showNoteForm() {
    const form = document.getElementById('note-form');
    const addBtn = document.getElementById('add-note-btn');
    
    if (form && addBtn) {
        form.classList.remove('hidden');
        addBtn.style.display = 'none';
        
        // Focus on textarea
        document.getElementById('note-content')?.focus();
    }
}

/**
 * Hide note form and reset
 */
function hideNoteForm() {
    const form = document.getElementById('note-form');
    const addBtn = document.getElementById('add-note-btn');
    const content = document.getElementById('note-content');
    
    if (form) {
        form.classList.add('hidden');
        currentEditingNoteId = null;
        
        // Reset form
        if (content) {
            content.value = '';
            content.placeholder = 'Add your personal notes about this candidate...';
        }
        
        // Update button text
        const saveBtn = document.getElementById('save-note-btn');
        if (saveBtn) {
            saveBtn.textContent = 'Save Note';
        }
    }
    
    // Don't automatically show Add Note button - let loadAndRenderNotes() handle visibility
}

/**
 * Save note (create or update)
 */
async function saveNote() {
    const content = document.getElementById('note-content')?.value.trim();
    
    if (!content) return;
    
    try {
        await updateCandidateNotes(candidate.candidate_id, content);
        await loadAndRenderNotes();
        hideNoteForm();
        showSuccess('Note saved successfully');
    } catch (error) {
        console.error('Error saving note:', error);
        showError('Error saving note');
    }
}

/**
 * Load and render notes from database
 */
async function loadAndRenderNotes() {
    const notesList = document.getElementById('notes-list');
    const addNoteBtn = document.getElementById('add-note-btn');
    if (!notesList) return;
    
    try {
        const response = await getCandidateNotes(candidate.candidate_id);
        const notes = response.notes;
        
        if (!notes || notes.trim() === '') {
            // Show Add Note button in header
            if (addNoteBtn) addNoteBtn.style.display = 'block';
            
            notesList.innerHTML = `
                <div class="text-center text-gray-500 text-sm py-8">
                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012-2h-1.586l-4.707 4.707z"></path>
                    </svg>
                    No personal notes yet. Click "Add Note" to start.
                </div>
            `;
            return;
        }
        
        // Hide Add Note button in header when there are notes
        if (addNoteBtn) addNoteBtn.style.display = 'none';
        
        // Display the note content with Edit/Delete buttons
        notesList.innerHTML = `
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div class="mb-3">
                    <p class="text-gray-800 text-sm leading-relaxed">${escapeHtml(notes)}</p>
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500">
                        <span>Personal note</span>
                    </div>
                    <div class="flex gap-2">
                        <button id="edit-note-btn" 
                                class="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                            Edit
                        </button>
                        <button id="delete-note-btn" 
                                class="text-red-600 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('edit-note-btn')?.addEventListener('click', () => editNote(notes));
        document.getElementById('delete-note-btn')?.addEventListener('click', deleteNote);
        
    } catch (error) {
        console.error('Error loading notes:', error);
        // Show Add Note button on error
        if (addNoteBtn) addNoteBtn.style.display = 'block';
        
        notesList.innerHTML = `
            <div class="text-center text-red-500 text-sm py-8">
                <p>Error loading notes. Please try again.</p>
            </div>
        `;
    }
}

/**
 * Create HTML element for a note
 */
function createNoteElement(note) {
    const createdDate = new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const wasEdited = note.updatedAt !== note.createdAt;
    const updatedDate = wasEdited ? new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '';
    
    return `
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="mb-3">
                <p class="text-gray-800 text-sm leading-relaxed">${escapeHtml(note.content)}</p>
            </div>
            <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                    <span>Added ${createdDate}</span>
                    ${wasEdited ? `<span class="ml-2">• Edited ${updatedDate}</span>` : ''}
                </div>
                <div class="flex gap-2">
                    <button id="edit-${note.id}" 
                            class="text-blue-600 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                        Edit
                    </button>
                    <button id="delete-${note.id}" 
                            class="text-red-600 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Edit note
 */
function editNote(noteContent) {
    // Load existing note content into form
    const content = document.getElementById('note-content');
    const saveBtn = document.getElementById('save-note-btn');
    
    if (content && saveBtn) {
        content.value = noteContent;
        content.placeholder = 'Edit your note...';
        saveBtn.textContent = 'Update Note';
        
        showNoteForm();
    }
}

/**
 * Delete note - opens confirmation modal
 */
function deleteNote() {
    openDeleteNoteModal();
}

/**
 * Open delete note confirmation modal
 */
function openDeleteNoteModal() {
    const modal = document.getElementById('deleteNoteModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Close delete note confirmation modal
 */
function closeDeleteNoteModal() {
    const modal = document.getElementById('deleteNoteModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Confirm note deletion (actual deletion)
 */
async function confirmDeleteNote() {
    try {
        // Delete by setting notes to empty string
        await updateCandidateNotes(candidate.candidate_id, '');
        await loadAndRenderNotes();
        showSuccess('Note deleted successfully');
        closeDeleteNoteModal();
    } catch (error) {
        console.error('Error deleting note:', error);
        showError('Error deleting note');
        closeDeleteNoteModal();
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialization when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {

    // Render navbar component
    renderNavbar('navbar-container');

    // Run guard to protect the page (DISABLED - waiting for users endpoint)
    const currentPage = window.location.pathname.split('/').pop();
    guard(currentPage);

    // If we get here, it means that the guard passed successfully
    loadCandidate();
});