import Sequelize from 'sequelize';
import config from './environment.js';

export const SQLite = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.path
});