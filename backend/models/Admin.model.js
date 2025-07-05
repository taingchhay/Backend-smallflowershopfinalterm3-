import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'admins',
    timestamps: false
});

export default Admin;