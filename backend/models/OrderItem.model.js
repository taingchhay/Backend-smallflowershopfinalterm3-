/**
 * OrderItem Model - Order Line Items
 *
 * This model represents individual items within an order.
 * Stores product details at the time of purchase for historical accuracy.
 *
 * Database Table: order_items
 *
 * Relationships:
 * - Many-to-One with Order (OrderItem belongs to Order)
 * - Many-to-One with Flower (OrderItem references Flower)
 *
 * Business Rules:
 * - Quantity must be positive
 * - Price is stored at time of purchase (may differ from current price)
 * - Product details are snapshotted for order history
 * - Total price is calculated as quantity * unit price
 *
 * @author Flower Shop Team
 * @version 2.0.0
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

/**
 * OrderItem Model Definition
 *
 * Defines the structure for individual items within orders.
 * Includes product snapshot for historical accuracy.
 */
const OrderItem = sequelize.define('OrderItem', {
    /**
     * Order ID - Foreign key to orders table
     */
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the order this item belongs to'
    },

    /**
     * Flower ID - Foreign key to flowers table
     *
     * References the original product, but product details
     * are snapshotted in case the product changes later
     */
    flowerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'flowers',
            key: 'id'
        },
        onDelete: 'RESTRICT', // Prevent deletion of products with order history
        comment: 'ID of the flower product'
    },

    /**
     * Quantity - Number of items ordered
     */
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Quantity must be at least 1'
            },
            max: {
                args: [999],
                msg: 'Quantity cannot exceed 999'
            }
        },
        comment: 'Number of items ordered'
    },

    /**
     * Unit Price - Price per item at time of purchase
     *
     * This is the price that was charged, which may differ
     * from the current product price
     */
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Unit price must be greater than 0'
            }
        },
        comment: 'Price per item at time of purchase'
    },

    /**
     * Total Price - Total cost for this line item
     *
     * Calculated as quantity * unitPrice
     */
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Total price must be greater than 0'
            }
        },
        comment: 'Total cost for this line item (quantity * unitPrice)'
    },

    /**
     * Product Snapshot - Flower details at time of purchase
     *
     * These fields preserve the product information as it was
     * when the order was placed, for historical accuracy
     */

    /**
     * Flower Name - Product name at time of purchase
     */
    flowerName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Product name at time of purchase'
    },

    /**
     * Flower Description - Product description at time of purchase
     */
    flowerDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Product description at time of purchase'
    },

    /**
     * Flower Image - Product image URL at time of purchase
     */
    flowerImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Product image URL at time of purchase'
    },

    /**
     * Flower Category - Product category at time of purchase
     */
    flowerCategory: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Product category at time of purchase'
    },
}, {
    // Table configuration
    tableName: 'order_items',
    timestamps: true, // Enable automatic createdAt and updatedAt
});

export default OrderItem;