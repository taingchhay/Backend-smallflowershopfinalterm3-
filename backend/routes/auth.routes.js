/**
 * Authentication Routes
 *
 * This file defines all authentication-related routes including
 * user registration, login, password reset, and email verification.
 *
 * Routes:
 * - POST /register - User registration
 * - POST /login - User login
 * - POST /logout - User logout (future)
 * - POST /forgot-password - Password reset request (future)
 * - POST /reset-password - Password reset (future)
 * - POST /verify-email - Email verification (future)
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {string} email - User email
 * @body {string} password - User password
 * @body {string} name - User full name (optional)
 * @body {string} username - Username (optional, generated from email if not provided)
 * @body {string} phone - Phone number (optional)
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body {string} email - User email or username
 * @body {string} password - User password
 */
router.post('/login', login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (placeholder for future implementation)
 * @access Private
 */
router.post('/logout', authenticateToken, (req, res) => {
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the token. This endpoint can be used for token blacklisting
    // or other logout-related operations in the future.
    res.json({ message: 'Logged out successfully' });
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        user: req.user
    });
});

export default router;