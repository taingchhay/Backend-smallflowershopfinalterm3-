import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
}, { 
    timestamps: false,
    tableName: 'users'
});

export default User;