/**
 * Authentication Controller - User Registration and Login
 *
 * This controller handles user authentication including registration,
 * login, password reset, and email verification.
 *
 * Features:
 * - User registration with email verification
 * - User login with JWT token generation
 * - Password hashing with bcrypt
 * - Input validation and sanitization
 * - Proper error handling and responses
 *
 * Security Considerations:
 * - Passwords are hashed with bcrypt (12 salt rounds)
 * - JWT tokens are signed with secret key
 * - Email and username uniqueness validation
 * - Rate limiting should be applied at middleware level
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Register a new user
 *
 * @route POST /api/auth/register
 * @access Public
 * @param {Object} req.body - Registration data
 * @param {string} req.body.username - Username (required)
 * @param {string} req.body.email - Email address (required)
 * @param {string} req.body.password - Password (required, min 6 characters)
 * @param {string} req.body.phone - Phone number (required)
 */
export const register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Input validation
        if (!email || !password || !username || !phone) {
            return res.status(400).json({
                message: 'All fields are required',
                errors: {
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null,
                    username: !username ? 'Username is required' : null,
                    phone: !phone ? 'Phone is required' : null
                }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        // Check if user already exists (using Sequelize syntax)
        const existingUser = await models.User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Check username uniqueness if provided
        if (username) {
            const existingUsername = await models.User.findOne({ where: { username: username.toLowerCase() } });
            if (existingUsername) {
                return res.status(400).json({
                    message: 'Username already taken'
                });
            }
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user (hooks will handle username generation if not provided)
        const user = await models.User.create({
            email,
            password: hashedPassword,
            phone,
            username
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Return success response (exclude sensitive data)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token
        });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = {};
            error.errors.forEach(err => {
                validationErrors[err.path] = err.message;
            });

            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return res.status(400).json({
                message: `${field} already exists`,
                errors: { [field]: `This ${field} is already registered` }
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

/**
 * Login user
 *
 * @route POST /api/auth/login
 * @access Public
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.email - Email address or username
 * @param {string} req.body.password - Password
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                errors: {
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Find user by email or username (using Sequelize syntax)
        const user = await models.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        // Update last login timestamp
        // await user.updateLastLogin();

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};