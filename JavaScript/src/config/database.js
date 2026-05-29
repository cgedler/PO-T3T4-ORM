import Sequelize from 'sequelize';
import config from './environment.js';

import { MSSql } from './mssql.connection.js';
import { MySql } from './mysql.connection.js';
import { Postgres } from './postgres.connection.js';
//import { SQLite } from './sqlite.connection.js';

var db;

switch(config.database.dialect) {
  case 'mssql':
    db = MSSql;
    break;
  case 'mysql':
    db = MySql;
    break;
  case 'postgres':
    db = Postgres;
    break;
  //case 'sqlite':
    //db = SQLite;
    //break;
  default:
    console.error('Unable to connect to the database - HandlerDB');
}

export default db;