import { guard } from '../utils/guard.js';

const vacancySelect = document.getElementById('vacancy');
const form = document.getElementById('cv_ai');
const loadingDiv = document.getElementById('loading');

async function loadVacancies() {
  try {
    const response = await fetch('http://localhost:9000/api/vacancies');
    const data = await response.json();

    // Fill in the select with id and title
    vacancySelect.innerHTML = '<option disabled selected>Select a vacancy</option>';
    data.forEach(v => {
      vacancySelect.innerHTML += `
        <option value="${v.vacancy_id}" data-title="${v.title}">
          ${v.title}
        </option>
      `;
    });
  } catch (error) {
    console.error('Error when showing vacancies:', error);
    alert('Error when showing vacancies');
  }
}

loadVacancies();

// ============================================================================
// HEADER FUNCTIONALITY - Added for project visual consistency
// ============================================================================

/**
 * Setup user dropdown functionality in the header
 */
function setupUserDropdown() {
  const userAvatar = document.getElementById('user-avatar');
  const userDropdown = document.getElementById('user-dropdown');

  if (userAvatar) {
    userAvatar.addEventListener('click', function () {
      userDropdown?.classList.toggle('hidden');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function (event) {
    if (!userAvatar?.contains(event.target) && !userDropdown?.contains(event.target)) {
      userDropdown?.classList.add('hidden');
    }
  });

  // Load user information from localStorage
  const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userName = loggedUser.name || 'Usuario';
  const userEmail = loggedUser.email || 'usuario@example.com';
  const initials = userName.split(' ').map(name => name.charAt(0)).join('');

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
      localStorage.removeItem('currentUser');
      localStorage.removeItem('returnUrl');
      window.location.href = '../index.html';
    });
  }
}

// Initialize header functionality when page loads
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'aiCvPage.html';
    
    //Run guard to protect the page (DISABLED - waiting for users endpoint)
    guard(currentPage);
    
    // Setup user dropdown
    setupUserDropdown();
});


document.getElementById('cv_ai').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  const selectedOption = vacancySelect.options[vacancySelect.selectedIndex];
  if (selectedOption) {
    formData.append("vacancy_id", selectedOption.value);      // id
    formData.append("vacancyTitle", selectedOption.dataset.title); // title
  }

  const loadingDiv = document.getElementById('loading');
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:9000/api/aicv/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error in request: ' + response.status);

    await response.json();
    form.reset();
  } catch (error) {
    console.error('Error while sending cv:', error);
    alert('Error while sending cv');
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

loadVacancies();
