/**
 * ProductReview Model - Customer Product Reviews
 * 
 * This model represents customer reviews and ratings for flower products.
 * Reviews help other customers make informed purchasing decisions.
 * 
 * Database Table: product_reviews
 * 
 * Relationships:
 * - Many-to-One with Flower (ProductReview belongs to Flower)
 * - Many-to-One with User (ProductReview belongs to User)
 * - Many-to-One with Order (ProductReview belongs to Order for verification)
 * 
 * Business Rules:
 * - Users can only review products they have purchased
 * - One review per product per order
 * - Reviews must have a rating (1-5 stars)
 * - Reviews can be moderated (approved/rejected)
 * - Verified purchase reviews are marked specially
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * ProductReview Model Definition
 * 
 * Defines the structure for customer product reviews.
 * Supports rating, comments, and moderation features.
 */
const ProductReview = sequelize.define('ProductReview', {
    /**
     * Flower ID - Foreign key to flowers table
     */
    flowerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'flowers',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the flower product being reviewed'
    },

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
        comment: 'ID of the user who wrote the review'
    },

    /**
     * Order ID - Foreign key to orders table (for verification)
     */
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for legacy reviews
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'ID of the order that contained this product (for verification)'
    },

    /**
     * Rating - Star rating (1-5)
     */
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Star rating from 1 to 5'
    },

    /**
     * Review Title - Short title for the review
     */
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Short title for the review'
    },

    /**
     * Review Comment - Detailed review text
     */
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed review text'
    },

    /**
     * Verified Purchase - Whether this review is from a verified purchase
     */
    isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this review is from a verified purchase'
    },

    /**
     * Approved Status - Whether the review has been approved for display
     */
    isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Auto-approve by default
        comment: 'Whether the review has been approved for display'
    },

    /**
     * Helpful Count - Number of users who found this review helpful
     */
    helpfulCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of users who found this review helpful'
    },

    /**
     * Reported Count - Number of times this review was reported
     */
    reportedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times this review was reported'
    },

    /**
     * Moderator Notes - Internal notes from moderators
     */
    moderatorNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Internal notes from moderators'
    },

    /**
     * Review Photos - JSON array of photo URLs
     */
    photos: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of photo URLs attached to the review'
    }
}, {
    // Table configuration
    tableName: 'product_reviews',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default ProductReview;