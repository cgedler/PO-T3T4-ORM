import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Seccion from './seccion.model.js';

const Sex = {
    F: "FEMALE",
    M: "MALE"
};

const Estudiante = db.define('app.estudiantes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sex: {
        type: DataTypes.ENUM(Sex.F, Sex.M)
    },
    birthdate: {
        type: DataTypes.DATE
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
});

Estudiante.hasOne(Seccion, {
    foreingKey: 'EstudianteId',
    sourceKey: 'id'
});

Seccion.belongsTo(Estudiante, {
    foreingKey: 'EstudianteId',
    targetId: 'id'
});

export default Estudiante;