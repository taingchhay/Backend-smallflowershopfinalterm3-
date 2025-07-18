/**
 * Flower Shop Backend Server
 *
 * This is the main server file that sets up the Express application,
 * configures middleware, connects to the database, and defines routes.
 *
 * Features:
 * - Express.js web framework
 * - PostgreSQL database with Sequelize ORM
 * - JWT authentication
 * - CORS enabled for frontend integration
 * - Security middleware (Helmet)
 * - Request logging (Morgan)
 * - Error handling
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

// Import database connection and models
import sequelize from './config/sequelize.js';
import models from './models/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import flowerRoutes from './routes/flower.routes.js';
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import reviewRoutes from './routes/review.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Flower Shop API',
        version: '2.0.0',
        documentation: '/api/docs',
        health: '/health'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    // Sequelize validation errors
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

    // Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        return res.status(409).json({
            message: `${field} already exists`,
            field
        });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        });
    }

    // Default error response
    res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Database connection and server startup
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync database models
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
            console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    await sequelize.close();
    process.exit(0);
});

// Start the server
startServer();