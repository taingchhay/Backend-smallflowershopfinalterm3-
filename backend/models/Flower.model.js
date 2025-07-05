import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Flower = sequelize.define('Flower', {
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: {
        type: DataTypes.STRING
    },
    price: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    },
    image: {
        type: DataTypes.STRING
    },
    stock: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
}, { 
    tableName: 'flowers',
    timestamps: false,
});

export default Flower;