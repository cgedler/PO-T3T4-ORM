import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const Role = {
    ADMIN: "ADMIN",
    USER: "USER"
};

const User = db.define('system.users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM(Role.ADMIN, Role.USER)
    }
});

export default User;