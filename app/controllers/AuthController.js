import AuthServices from '../models/services/AuthServices.js';

/**
 * Authentication controller handling login and registration requests
 */
export default class AuthController {
    
    /**
     * Handles user registration
     * @async
     * @function register
     * @param {Object} req - Express request object
     * @param {Object} req.body - Registration data
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with user data or error
     */
    static async register(req, res) {
        try {
            const userData = req.body;
            
            // Validate input
            const validation = AuthServices.validateRegistration(userData);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }
            
            // Register user
            const user = await AuthServices.registerUser(userData);
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Check for specific errors
            if (error.message === 'User already exists with this email') {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error during registration'
            });
        }
    }
    
    /**
     * Handles user login
     * @async
     * @function login
     * @param {Object} req - Express request object
     * @param {Object} req.body - Login credentials
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with user data or error
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate input
            const validation = AuthServices.validateLogin({ email, password });
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }
            
            // Authenticate user
            const user = await AuthServices.loginUser(email, password);
            
            res.json({
                success: true,
                message: 'Login successful',
                data: user
            });
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Check for authentication errors
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error during login'
            });
        }
    }
    
    /**
     * Handles user logout (stateless, mainly for consistency)
     * @async
     * @function logout
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response confirming logout
     */
    static async logout(req, res) {
        try {
            // For stateless authentication, logout is handled on the frontend
            // This endpoint exists for consistency and future token invalidation if needed
            res.json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during logout'
            });
        }
    }
    
    /**
     * Handles password change requests
     * @async
     * @function changePassword
     * @param {Object} req - Express request object
     * @param {Object} req.body - Password change data
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response confirming password change
     */
    static async changePassword(req, res) {
        try {
            const { email, currentPassword, newPassword } = req.body;
            
            // Validate input
            if (!email || !currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, current password, and new password are required'
                });
            }
            
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long'
                });
            }
            
            // Verify current credentials
            await AuthServices.loginUser(email, currentPassword);
            
            // Hash new password and update user
            const User = (await import('../models/entities/UserEntity.js')).default;
            const hashedNewPassword = await User.hashPassword(newPassword);
            
            await User.update(
                { password: hashedNewPassword },
                { where: { email } }
            );
            
            res.json({
                success: true,
                message: 'Password changed successfully'
            });
            
        } catch (error) {
            console.error('Change password error:', error);
            
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error during password change'
            });
        }
    }
}
