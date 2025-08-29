import { isEmailValid, isPasswordValid } from "../utils/validators.js";
import { guard } from "../utils/guard.js";
import { loginUser } from "../api/users.js";

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (!toggleButton || !passwordInput || !eyeIcon) return;

    toggleButton.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';

        // Change input type
        passwordInput.type = isPassword ? 'text' : 'password';

        // Change icon
        if (isPassword) {
            // Crossed eye (password visible)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
            `;
        } else {
            // Normal eye (password hidden)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            `;
        }
    });
}

/**
 * Initialize the login form
 */
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validations
        if (!isEmailValid(email)) {
            showError("Please enter a valid email address");
            return;
        }

        if (!isPasswordValid(password)) {
            showError("Password must be at least 4 characters long");
            return;
        }

        // Loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;

        try {
            // Authentication using new backend API
            const response = await loginUser(email, password);

            if (response.success && response.data) {
                const user = response.data;
                
                // Save Session
                localStorage.setItem('currentUser', JSON.stringify({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                    loginTime: new Date().toISOString()
                }));

                // Show success message
                showMessage("Login successful! Redirecting...", 'success');

                // Redirect to vacancies after a short delay
                setTimeout(() => {
                    window.location.href = 'vacanciesPage.html';
                }, 1000);
            } else {
                showError("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            showError(error.message || "Login failed. Please check your connection and try again.");
        } finally {
            // Restore button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

/**
 * Displays temporary error message
 */
function showError(message) {
    showMessage(message, 'error');
}

/**
 * Displays temporary message
 */
function showMessage(message, type = 'error') {
    // Remove existing message
    const existingMessage = document.getElementById('message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    
    const baseClasses = 'px-4 py-3 rounded-xl text-sm animate-fade-in mb-4';
    
    if (type === 'success') {
        messageDiv.className = `bg-green-50 border border-green-200 text-green-600 ${baseClasses}`;
    } else {
        messageDiv.className = `bg-red-50 border border-red-200 text-red-600 ${baseClasses}`;
    }

    messageDiv.textContent = message;

    const form = document.getElementById('loginForm');
    form.insertBefore(messageDiv, form.firstChild);

    // Hide after 5 seconds
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.remove();
        }
    }, 5000);
}

/**
 * Initialization when the DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
    // Enable guard system for login page protection
    guard("loginPage.html");

    // Initialize functionalities
    initPasswordToggle();
    initLoginForm();
});
