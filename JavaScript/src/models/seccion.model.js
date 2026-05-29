import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const Seccion = db.define('app.secciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Seccion;