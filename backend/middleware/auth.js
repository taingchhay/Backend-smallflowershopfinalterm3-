/**
 * Authentication Middleware
 *
 * This middleware handles JWT token verification and user authentication.
 * It provides authentication for users only.
 *
 * Features:
 * - JWT token verification
 * - User authentication
 * - Proper error handling and responses
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { User } = models;

/**
 * Authenticate JWT Token
 *
 * Verifies JWT token and attaches user information to request object.
 * Used for protected routes that require user authentication.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                message: 'Access token required',
                error: 'MISSING_TOKEN'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET || process.env.JWT_SECRET);

        // Find user in database to ensure they still exist
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                error: 'USER_NOT_FOUND'
            });
        }

        // Attach user info to request
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                message: 'Invalid token',
                error: 'INVALID_TOKEN'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Token expired',
                error: 'TOKEN_EXPIRED'
            });
        }

        return res.status(500).json({
            message: 'Authentication failed',
            error: 'AUTH_ERROR'
        });
    }
};

/**
 * Require Admin Role
 *
 * Middleware to ensure authenticated user has admin role.
 * Should be used after authenticateToken middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requireAdmin = (req, res, next) => {  
    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required',
            error: 'NOT_AUTHENTICATED'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Admin access required',
            error: 'INSUFFICIENT_PERMISSIONS'
        });
    }

    next();
};