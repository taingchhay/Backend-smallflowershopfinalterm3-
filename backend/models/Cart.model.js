import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // refers to table name
      key: 'id'
    },
    primaryKey: true
  },
  flowerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'flowers', // refers to table name
      key: 'id'
    },
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'carts',
  timestamps: false
});

export default Cart;