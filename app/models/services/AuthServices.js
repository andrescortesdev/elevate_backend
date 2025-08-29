import User from '../entities/UserEntity.js';
import * as UserServices from './UserServices.js';

/**
 * Authentication service class containing login and registration logic
 */
export default class AuthServices {
    
    /**
     * Registers a new user with hashed password
     * @async
     * @function registerUser
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's plain text password
     * @param {number} userData.role_id - User's role ID
     * @returns {Promise<Object>} User object without password
     * @throws {Error} Throws error if user already exists or registration fails
     */
    static async registerUser(userData) {
        const { email, password, name, role_id } = userData;
        
        try {
            // Check if user already exists
            const existingUser = await UserServices.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            
            // Hash the password
            const hashedPassword = await User.hashPassword(password);
            
            // Create user with hashed password
            const { user } = await UserServices.createUserUpsert({
                name,
                email,
                password: hashedPassword,
                role_id: role_id || 1 // Default role if not provided
            });
            
            // Return user without password
            const { password: _, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
            
        } catch (error) {
            console.error('Error in registerUser:', error);
            throw error;
        }
    }
    
    /**
     * Authenticates a user with email and password
     * @async
     * @function loginUser
     * @param {string} email - User's email address
     * @param {string} password - User's plain text password
     * @returns {Promise<Object>} User object without password
     * @throws {Error} Throws error if credentials are invalid
     */
    static async loginUser(email, password) {
        try {
            // Get user by email
            const user = await UserServices.getUserByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }
            
            // Verify password
            const isValidPassword = await User.verifyPassword(user.password, password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }
            
            // Return user without password
            const { password: _, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
            
        } catch (error) {
            console.error('Error in loginUser:', error);
            throw error;
        }
    }
    
    /**
     * Validates user input for registration
     * @param {Object} userData - User data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    static validateRegistration(userData) {
        const errors = [];
        const { name, email, password, role_id } = userData;
        
        if (!name || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!email || !email.includes('@')) {
            errors.push('Valid email is required');
        }
        
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        
        if (role_id && (typeof role_id !== 'number' || role_id < 1)) {
            errors.push('Role ID must be a positive number');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Validates user input for login
     * @param {Object} credentials - Login credentials to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    static validateLogin(credentials) {
        const errors = [];
        const { email, password } = credentials;
        
        if (!email || !email.includes('@')) {
            errors.push('Valid email is required');
        }
        
        if (!password) {
            errors.push('Password is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
