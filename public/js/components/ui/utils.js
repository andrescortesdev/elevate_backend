/**
 * Simple utility functions extracted from duplicated code
 */

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @param {number} maxLength - Maximum number of initials (default: 2)
 * @returns {string} Initials in uppercase
 */
export function generateInitials(name, maxLength = 2) {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, maxLength).toUpperCase();
}

/**
 * Format date to Spanish locale
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Parse JSON safely with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
export function safeJSONParse(jsonString, fallback = []) {
    try {
        return Array.isArray(jsonString) ? jsonString : JSON.parse(jsonString || '[]');
    } catch (error) {
        return fallback;
    }
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}