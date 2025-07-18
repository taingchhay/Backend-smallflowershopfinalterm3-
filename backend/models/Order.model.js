/**
 * Order Model - Order Management System
 *
 * This model represents customer orders in the flower shop system.
 * Supports complete order lifecycle from creation to delivery.
 *
 * Database Table: orders
 *
 * Relationships:
 * - Many-to-One with User (Order belongs to User)
 * - One-to-Many with OrderItem (Order has many items)
 * - Many-to-One with ShippingAddress (Order ships to address)
 * - One-to-Many with ProductReview (Order enables reviews)
 *
 * Business Rules:
 * - Orders must have at least one item
 * - Total must match sum of item totals + shipping + tax
 * - Status progression: pending → processing → in_transit → delivered
 * - Cancelled orders cannot be modified
 * - Order numbers must be unique and human-readable
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * Order Model Definition
 *
 * Defines the structure for customer orders with complete
 * shipping, payment, and tracking information.
 */
const Order = sequelize.define('Order', {
    /**
     * User ID - Foreign key to users table
     *
     * Links order to the customer who placed it
     */
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the user who placed the order'
    },

    /**
     * Order Number - Human-readable order identifier
     *
     * Format: FS-YYYY-NNNNNN (e.g., FS-2024-000001)
     * Used for customer reference and support
     */
    orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: 'unique_order_number',
            msg: 'Order number must be unique'
        },
        comment: 'Human-readable order number for customer reference'
    },

    /**
     * Order Status - Current state of the order
     *
     * Status progression:
     * - pending: Order placed, payment pending
     * - processing: Payment confirmed, preparing order
     * - in_transit: Order shipped, in delivery
     * - delivered: Order successfully delivered
     * - cancelled: Order cancelled by customer or admin
     * - refunded: Order refunded
     */
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'in_transit', 'delivered', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current status of the order'
    },

    /**
     * Subtotal - Total cost of items before shipping and tax
     */
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Subtotal must be greater than 0'
            }
        },
        comment: 'Total cost of items before shipping and tax'
    },

    /**
     * Shipping Cost - Cost of shipping/delivery
     */
    shippingCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0],
                msg: 'Shipping cost cannot be negative'
            }
        },
        comment: 'Cost of shipping and delivery'
    },

    /**
     * Tax Amount - Calculated tax amount
     */
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0],
                msg: 'Tax amount cannot be negative'
            }
        },
        comment: 'Calculated tax amount'
    },

    /**
     * Total - Final order total (subtotal + shipping + tax)
     */
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Total must be greater than 0'
            }
        },
        comment: 'Final order total including all costs'
    },

    /**
     * Currency - Order currency code
     */
    currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        validate: {
            len: {
                args: [3, 3],
                msg: 'Currency must be 3 characters'
            }
        },
        comment: 'Currency code for the order'
    },

    /**
     * Shipping Address ID - Foreign key to shipping_addresses table
     */
    shippingAddressId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for pickup orders
        references: {
            model: 'shipping_addresses',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'ID of the shipping address'
    },

    /**
     * Shipping Method - Type of shipping selected
     */
    shippingMethod: {
        type: DataTypes.ENUM('standard', 'express', 'overnight', 'pickup'),
        allowNull: false,
        defaultValue: 'standard',
        comment: 'Selected shipping method'
    },

    /**
     * Tracking Number - Shipping carrier tracking number
     */
    trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Shipping carrier tracking number'
    },

    /**
     * Estimated Delivery Date
     */
    estimatedDelivery: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Estimated delivery date'
    },

    /**
     * Actual Delivery Timestamp
     */
    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual delivery timestamp'
    },

    /**
     * Payment Method - How the customer paid
     */
    paymentMethod: {
        type: DataTypes.ENUM('credit_card', 'paypal', 'stripe', 'cash_on_delivery'),
        allowNull: false,
        comment: 'Payment method used'
    },

    /**
     * Payment Status - Current payment state
     */
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current payment status'
    },

    /**
     * Payment Reference - External payment system reference
     */
    paymentReference: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'External payment system reference ID'
    },

    /**
     * Special Instructions - Customer delivery instructions
     */
    specialInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: 'Special instructions cannot exceed 1000 characters'
            }
        },
        comment: 'Special delivery instructions from customer'
    },

    /**
     * Gift Message - Message for gift orders
     */
    giftMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Gift message cannot exceed 500 characters'
            }
        },
        comment: 'Gift message for the recipient'
    },

    /**
     * Discount Amount - Total discount applied
     */
    discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0],
                msg: 'Discount amount cannot be negative'
            }
        },
        comment: 'Total discount amount applied'
    },

    /**
     * Discount Code - Coupon or promo code used
     */
    discountCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Coupon or promotional code used'
    },

    /**
     * Notes - Internal admin notes
     */
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Internal notes for admin use'
    }
}, {
    // Table configuration
    tableName: 'orders',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default Order;