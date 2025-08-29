// Frontend API Configuration
// Centralized configuration for all API endpoints and constants

export const API_CONFIG = {
    BASE_URL: 'https://elevate-backend-eight.vercel.app/api',
    ENDPOINTS: {
        USERS: 'users',
        VACANCIES: 'vacancies', 
        CANDIDATES: 'candidates',
        APPLICATIONS: 'applications',
        AI: 'ai',
        AUTH: 'auth'
    }
};

// Base URL without /api (for endpoints that already include it)
export const API_URL = API_CONFIG.BASE_URL;

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint) => {
    return `${API_URL}/${endpoint}`;
};

// Common API URLs for easy access
export const API_URLS = {
    USERS: buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
    VACANCIES: buildApiUrl(API_CONFIG.ENDPOINTS.VACANCIES),
    CANDIDATES: buildApiUrl(API_CONFIG.ENDPOINTS.CANDIDATES),
    APPLICATIONS: buildApiUrl(API_CONFIG.ENDPOINTS.APPLICATIONS),
    AI: buildApiUrl(API_CONFIG.ENDPOINTS.AI),
    AUTH: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH)
};