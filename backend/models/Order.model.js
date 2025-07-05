import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Order = sequelize.define('Order', {
    total: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    status: { 
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'), 
        defaultValue: 'pending' 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
}, { 
    tableName: 'orders',
    timestamps: false 
});

export default Order;