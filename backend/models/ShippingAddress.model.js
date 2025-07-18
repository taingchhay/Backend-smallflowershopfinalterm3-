/**
 * ShippingAddress Model - Customer Delivery Addresses
 * 
 * This model represents shipping addresses for customer orders.
 * Users can have multiple addresses for different delivery locations.
 * 
 * Database Table: shipping_addresses
 * 
 * Relationships:
 * - Many-to-One with User (ShippingAddress belongs to User)
 * - One-to-Many with Order (ShippingAddress can be used for multiple orders)
 * 
 * Business Rules:
 * - Users can have multiple addresses
 * - Only one address can be marked as default per user
 * - Address validation should be performed at application level
 * - Addresses should be preserved for order history
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * ShippingAddress Model Definition
 * 
 * Defines the structure for customer shipping addresses.
 * Supports international addresses with flexible formatting.
 */
const ShippingAddress = sequelize.define('ShippingAddress', {
    /**
     * User ID - Foreign key to users table
     */
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the user who owns this address'
    },

    /**
     * Recipient Name - Name of the person receiving the delivery
     */
    recipientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the person receiving the delivery'
    },

    /**
     * Address Line 1 - Primary address line (street, number)
     */
    addressLine1: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Primary address line (street and number)'
    },

    /**
     * Address Line 2 - Secondary address line (apartment, suite, etc.)
     */
    addressLine2: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Secondary address line (apartment, suite, etc.)'
    },

    /**
     * City - City or locality
     */
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'City or locality'
    },

    /**
     * State/Province - State, province, or region
     */
    state: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'State, province, or region'
    },

    /**
     * Postal Code - ZIP code or postal code
     */
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'ZIP code or postal code'
    },

    /**
     * Country - Country name
     */
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'United States',
        comment: 'Country name'
    },

    /**
     * Phone Number - Contact phone for delivery
     */
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Contact phone number for delivery'
    },

    /**
     * Default Address Flag - Whether this is the user's default address
     */
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is the user default shipping address'
    },

    /**
     * Address Type - Type of address for organization
     */
    addressType: {
        type: DataTypes.ENUM('home', 'work', 'other'),
        allowNull: false,
        defaultValue: 'home',
        comment: 'Type of address for organization'
    },

    /**
     * Delivery Instructions - Special instructions for delivery
     */
    deliveryInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Delivery instructions cannot exceed 500 characters'
            }
        },
        comment: 'Special instructions for delivery'
    }
}, {
    // Table configuration
    tableName: 'shipping_addresses',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default ShippingAddress;