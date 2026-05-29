import Sequelize from 'sequelize';
import config from './environment.js';

export const Postgres = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    dialectOptions: {
        options: {
            encrypt: config.database.encrypt
        }
    }
});