/**
 * Authentication middleware for protecting routes
 * This middleware can be used to protect routes that require authentication
 */

import jwt from 'jsonwebtoken';
import * as UserServices from '../models/services/UserServices.js';

/**
 * Middleware to verify JWT token (for future implementation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        
        // Verify JWT token (implement when JWT is added)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await UserServices.getUserById(decoded.user_id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

/**
 * Middleware to check user role
 * @param {Array|string} allowedRoles - Array of allowed role IDs or single role ID
 * @returns {Function} Express middleware function
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role_id;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        
        next();
    };
};

/**
 * Basic authentication check for session-based auth (current implementation)
 * This is a simplified version for demonstration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requireAuth = (req, res, next) => {
    // For session-based auth, you might check for session data
    // This is a placeholder - implement based on your session strategy
    
    const userId = req.headers['user-id']; // Example: client sends user ID in headers
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    // Add user ID to request for use in controllers
    req.userId = userId;
    next();
};

/**
 * Middleware to validate request body fields
 * @param {Array} requiredFields - Array of required field names
 * @returns {Function} Express middleware function
 */
export const validateFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }
        
        next();
    };
};

/**
 * Rate limiting middleware (basic implementation)
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
export const rateLimit = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
    const clients = new Map();
    
    return (req, res, next) => {
        const clientId = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!clients.has(clientId)) {
            clients.set(clientId, { requests: 1, resetTime: now + windowMs });
            return next();
        }
        
        const client = clients.get(clientId);
        
        if (now > client.resetTime) {
            client.requests = 1;
            client.resetTime = now + windowMs;
            return next();
        }
        
        if (client.requests >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later'
            });
        }
        
        client.requests++;
        next();
    };
};
