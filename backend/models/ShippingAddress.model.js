import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ShippingAddress = sequelize.define('ShippingAddress', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // refers to table name, not the model name
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: deletes addresses if user is deleted
    },
  street: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Street and house number',
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'City or district',
  },
  commune: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Commune or ward',
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Province or state',
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Postal or ZIP code (optional)',
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Cambodia',
    comment: 'Country',
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'e.g., Home, Office, Mom\'s House',
  },
}, {
  tableName: 'shipping_addresses',
  timestamps: true,
});

export default ShippingAddress;