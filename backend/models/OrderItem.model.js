import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const OrderItem = sequelize.define('OrderItem', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    flowerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'flowers', // Must match the actual table name
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
}, { 
    tableName: 'orderItems',
    timestamps: false 
});

export default OrderItem;