/**
 * Models Index - Cleaned Associations
 * 
 * Models: User, Flower, Cart
 * Relationships:
 * - User <-> Flower (Many-to-Many through Cart)
 * - Cart belongs to User and Flower
 */

import User from './User.model.js';
import Flower from './Flower.model.js';
import Cart from './Cart.model.js';
import ShippingAddress from './ShippingAddress.model.js';

/**
 * Many-to-Many: User ↔ Flower (through Cart)
 */
User.belongsToMany(Flower, {
  through: Cart,
  foreignKey: 'userId',
  otherKey: 'flowerId',
  as: 'cartItems'
});

Flower.belongsToMany(User, {
  through: Cart,
  foreignKey: 'flowerId',
  otherKey: 'userId',
  as: 'inCarts'
});

/**
 * One-to-Many: User → Cart
 */
User.hasMany(Cart, {
  foreignKey: 'userId',
  as: 'cartEntries',
  onDelete: 'CASCADE'
});
Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

/**
 * One-to-Many: Flower → Cart
 */
Flower.hasMany(Cart, {
  foreignKey: 'flowerId',
  as: 'cartEntries',
  onDelete: 'CASCADE'
});
Cart.belongsTo(Flower, {
  foreignKey: 'flowerId',
  as: 'flower'
});

User.hasMany(ShippingAddress, { foreignKey: 'userId', as: 'shippingAddresses' });
ShippingAddress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// In your model associations
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(ShippingAddress, { foreignKey: 'shippingAddressId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Flower, { foreignKey: 'flowerId' });

/**
 * Export active models
 */
const models = {
  User,
  Flower,
  Cart,
  ShippingAddress
};

export default models;