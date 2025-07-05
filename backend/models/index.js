import User from './User.model.js';
import Flower from './Flower.model.js';
import Order from './Order.model.js';
import OrderItem from './OrderItem.model.js';
import Admin from './Admin.model.js';

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Flower, { through: OrderItem, foreignKey: 'orderId', otherKey: 'flowerId' });
Flower.belongsToMany(Order, { through: OrderItem, foreignKey: 'flowerId', otherKey: 'orderId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Flower.hasMany(OrderItem, { foreignKey: 'flowerId' });
OrderItem.belongsTo(Flower, { foreignKey: 'flowerId' });

const model = { User, Flower, Order, OrderItem, Admin };

export default model;