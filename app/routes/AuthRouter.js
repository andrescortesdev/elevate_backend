import { Router } from "express";
import AuthController from '../controllers/AuthController.js';

/**
 * Express router instance for handling authentication routes.
 * This router manages all HTTP requests related to user authentication
 * including login, registration, logout, and password management.
 * 
 * @type {import('express').Router}
 */
const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 * @body {Object} userData - User registration data
 * @body {string} userData.name - User's full name
 * @body {string} userData.email - User's email address
 * @body {string} userData.password - User's password (will be hashed)
 * @body {number} [userData.role_id=1] - User's role ID (optional, defaults to 1)
 * @returns {Object} 201 - User created successfully
 * @returns {Object} 400 - Validation error
 * @returns {Object} 409 - User already exists
 * @returns {Object} 500 - Internal server error
 */
router.post("/register", AuthController.register);

/**
 * POST /api/auth/login
 * Authenticate user and login
 * @body {Object} credentials - Login credentials
 * @body {string} credentials.email - User's email address
 * @body {string} credentials.password - User's password
 * @returns {Object} 200 - Login successful with user data
 * @returns {Object} 400 - Validation error
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 500 - Internal server error
 */
router.post("/login", AuthController.login);

/**
 * POST /api/auth/logout
 * Logout user (stateless endpoint for consistency)
 * @returns {Object} 200 - Logout successful
 * @returns {Object} 500 - Internal server error
 */
router.post("/logout", AuthController.logout);

/**
 * PUT /api/auth/change-password
 * Change user password
 * @body {Object} passwordData - Password change data
 * @body {string} passwordData.email - User's email address
 * @body {string} passwordData.currentPassword - Current password
 * @body {string} passwordData.newPassword - New password
 * @returns {Object} 200 - Password changed successfully
 * @returns {Object} 400 - Validation error
 * @returns {Object} 401 - Current password incorrect
 * @returns {Object} 500 - Internal server error
 */
router.put("/change-password", AuthController.changePassword);

export default router;
