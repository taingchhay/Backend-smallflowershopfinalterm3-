/**
 * User Model - Customer Account Management
 *
 * This model represents customer accounts in the flower shop system.
 * Users can register, login, browse flowers, and place orders.
 *
 * Database Table: users
 *
 * Relationships:
 * - One-to-Many with Order (User can have multiple orders)
 * - One-to-Many with ShippingAddress (User can have multiple addresses)
 * - One-to-Many with ProductReview (User can review products)
 * - One-to-Many with Wishlist (User can have wishlist items)
 *
 * Security Considerations:
 * - Passwords should be hashed before storing (use bcrypt)
 * - Email must be unique
 * - Input validation should be performed at controller level
 *
 * @author Flower Shop Team
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * User Model Definition
 *
 * Defines the structure and constraints for user accounts.
 * All users start as regular customers with the ability to place orders.
 */
const User = sequelize.define('User', {
    /**
     * Username - Unique identifier for login (deprecated)
     *
     * Constraints:
     * - Must be unique across all users
     * - Cannot be null
     */
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique username for user identification (deprecated)'
    },

    /**
     * Email Address - Primary contact and login method
     *
     * Constraints:
     * - Must be unique across all users
     * - Must be valid email format
     * - Used for password reset and order notifications
     */
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'User email address for login and notifications'
    },

    /**
     * Password Hash - Encrypted password storage
     *
     * Security Notes:
     * - NEVER store plain text passwords
     * - Use bcrypt with salt rounds >= 10
     * - Validate password strength at application level
     */
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hashed password using bcrypt'
    },

    /**
     * Phone Number - Optional contact information
     */
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'User phone number for contact'
    },

    /**
     * User Role - For authorization
     */
    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        allowNull: false,
        defaultValue: 'customer',
        comment: 'User role for authorization'
    },
}, {
    // Table configuration
    tableName: 'users',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default User;