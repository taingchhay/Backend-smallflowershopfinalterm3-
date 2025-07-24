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

// Import routes
import authRoutes from './routes/auth.routes.js';
import flowerRoutes from './routes/flower.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/flower', flowerRoutes);

// Database connection and server startup
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();