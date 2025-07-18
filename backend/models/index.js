/**
 * Models Index - Database Model Relationships
 * 
 * This file imports all database models and establishes their relationships.
 * Sequelize associations are defined here to ensure proper foreign key
 * constraints and enable eager loading with include statements.
 * 
 * Model Relationships:
 * - User: hasMany Orders, ShippingAddresses, ProductReviews, Wishlists
 * - Flower: hasMany OrderItems, ProductReviews, Wishlists
 * - Order: belongsTo User, hasMany OrderItems, belongsTo ShippingAddress
 * - OrderItem: belongsTo Order, belongsTo Flower
 * - ShippingAddress: belongsTo User, hasMany Orders
 * - ProductReview: belongsTo User, belongsTo Flower, belongsTo Order
 * - Wishlist: belongsTo User, belongsTo Flower
 * 
 * @author Flower Shop Team
 * @version 1.0.0
 */

import User from './User.model.js';
import Flower from './Flower.model.js';
import Order from './Order.model.js';
import OrderItem from './OrderItem.model.js';
import ShippingAddress from './ShippingAddress.model.js';
import ProductReview from './ProductReview.model.js';
import Wishlist from './Wishlist.model.js';

/**
 * User Associations
 *
 * Users are the central entity with relationships to most other models
 */

// User -> Orders (One-to-Many)
User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
    onDelete: 'CASCADE'
});
Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User -> Shipping Addresses (One-to-Many)
User.hasMany(ShippingAddress, {
    foreignKey: 'userId',
    as: 'shippingAddresses',
    onDelete: 'CASCADE'
});
ShippingAddress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User -> Product Reviews (One-to-Many)
User.hasMany(ProductReview, {
    foreignKey: 'userId',
    as: 'reviews',
    onDelete: 'CASCADE'
});
ProductReview.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User -> Wishlist Items (One-to-Many)
User.hasMany(Wishlist, {
    foreignKey: 'userId',
    as: 'wishlistItems',
    onDelete: 'CASCADE'
});
Wishlist.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

/**
 * Flower Associations
 *
 * Flowers are products that can be ordered, reviewed, and wishlisted
 */

// Flower -> Order Items (One-to-Many)
Flower.hasMany(OrderItem, {
    foreignKey: 'flowerId',
    as: 'orderItems',
    onDelete: 'RESTRICT' // Prevent deletion of products with order history
});
OrderItem.belongsTo(Flower, {
    foreignKey: 'flowerId',
    as: 'flower'
});

// Flower -> Product Reviews (One-to-Many)
Flower.hasMany(ProductReview, {
    foreignKey: 'flowerId',
    as: 'reviews',
    onDelete: 'CASCADE'
});
ProductReview.belongsTo(Flower, {
    foreignKey: 'flowerId',
    as: 'flower'
});

// Flower -> Wishlist Items (One-to-Many)
Flower.hasMany(Wishlist, {
    foreignKey: 'flowerId',
    as: 'wishlistItems',
    onDelete: 'CASCADE'
});
Wishlist.belongsTo(Flower, {
    foreignKey: 'flowerId',
    as: 'flower'
});

/**
 * Order Associations
 *
 * Orders connect users with products and shipping information
 */

// Order -> Order Items (One-to-Many)
Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

// Order -> Shipping Address (Many-to-One)
Order.belongsTo(ShippingAddress, {
    foreignKey: 'shippingAddressId',
    as: 'shippingAddress'
});
ShippingAddress.hasMany(Order, {
    foreignKey: 'shippingAddressId',
    as: 'orders'
});

// Order -> Product Reviews (One-to-Many)
Order.hasMany(ProductReview, {
    foreignKey: 'orderId',
    as: 'reviews',
    onDelete: 'SET NULL'
});
ProductReview.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

/**
 * Many-to-Many Relationships (through junction tables)
 *
 * These create convenient access patterns for complex queries
 */

// User -> Flowers (Many-to-Many through Wishlist)
User.belongsToMany(Flower, {
    through: Wishlist,
    foreignKey: 'userId',
    otherKey: 'flowerId',
    as: 'wishlistedFlowers'
});

Flower.belongsToMany(User, {
    through: Wishlist,
    foreignKey: 'flowerId',
    otherKey: 'userId',
    as: 'wishlistedByUsers'
});

/**
 * Export all models for use in controllers and routes
 *
 * This object provides a centralized access point for all models
 * and ensures that all associations are properly established
 */
const models = {
    User,
    Flower,
    Order,
    OrderItem,
    ShippingAddress,
    ProductReview,
    Wishlist
};

export default models;

/**
 * Individual model exports for direct imports
 *
 * These exports allow importing specific models when needed
 */
export {
    User,
    Flower,
    Order,
    OrderItem,
    ShippingAddress,
    ProductReview,
    Wishlist
};