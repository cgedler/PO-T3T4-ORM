import Sequelize from 'sequelize';
import config from './environment.js';

export const MySql = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    dialectOptions: {
        options: {
            encrypt: config.database.encrypt
        }
    }
});