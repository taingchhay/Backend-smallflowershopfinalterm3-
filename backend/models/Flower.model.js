/**
 * Flower Model - Product Catalog Management
 *
 * This model represents flower products available in the shop.
 * Includes bouquets, potted plants, gift baskets, and seasonal arrangements.
 *
 * Database Table: flowers
 *
 * Relationships:
 * - Many-to-Many with Order (through OrderItem)
 * - One-to-Many with OrderItem (for order details)
 * - One-to-Many with ProductReview (for customer reviews)
 * - One-to-Many with Wishlist (for user wishlists)
 *
 * Business Rules:
 * - Stock levels must be tracked for inventory management
 * - Prices should be positive values
 * - Images should be validated URLs or file paths
 * - Products can be marked as seasonal or featured
 * - Categories help with filtering and organization
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * Flower Model Definition
 *
 * Defines the structure for flower products in the catalog.
 * Supports various product types with comprehensive metadata.
 */
const Flower = sequelize.define('Flower', {
    /**
     * Product Name - Display name for the flower product
     *
     * Examples: "Red Rose Bouquet", "Sunflower Arrangement", "Orchid Plant"
     */
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Display name of the flower product'
    },

    /**
     * Product Description - Detailed description of the flower arrangement
     *
     * Should include:
     * - Flower types and colors
     * - Arrangement style
     * - Occasion suitability
     * - Care instructions (for plants)
     */
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed description of the flower product'
    },

    /**
     * Product Price - Current selling price in base currency
     *
     * Business Rules:
     * - Must be positive value
     * - Stored as decimal for precision
     * - Used for cart calculations and display
     */
    price: {
        type: DataTypes.DECIMAL(10, 2), // Up to 99,999,999.99
        allowNull: false,
        comment: 'Current selling price in base currency'
    },

    /**
     * Product Image URL - Main product image
     *
     * Can be:
     * - Full URL to external image service
     * - Relative path to uploaded image
     * - CDN URL for optimized delivery
     */
    image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL or path to the main product image'
    },

    /**
     * Product Category - Type of flower product
     *
     * Categories help with:
     * - Product filtering and search
     * - Inventory organization
     * - Seasonal promotions
     * - Frontend navigation
     */
    category: {
        type: DataTypes.ENUM(
            'roses',        // Rose bouquets and arrangements
            'sunflowers',   // Sunflower arrangements
            'lilies',       // Lily arrangements
            'tulips',       // Tulip bouquets
            'orchids',      // Orchid plants and arrangements
            'mixed',        // Mixed flower arrangements
            'bouquet',      // General bouquets
            'arrangement',  // Vase arrangements
            'plant',        // Potted plants
            'gift_basket',  // Gift baskets with flowers
            'seasonal',     // Holiday/seasonal items
            'wedding',      // Wedding-specific arrangements
            'sympathy'      // Funeral/sympathy flowers
        ),
        allowNull: false,
        defaultValue: 'bouquet',
        comment: 'Product category for organization and filtering'
    },

    /**
     * Stock Quantity - Available inventory count
     *
     * Business Rules:
     * - Cannot be negative
     * - Zero stock means out of stock
     * - Should trigger reorder alerts when low
     * - Updated when orders are placed
     */
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Available inventory quantity'
    },
}, {
    // Table configuration
    tableName: 'flowers',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default Flower;