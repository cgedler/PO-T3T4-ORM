import logger from '../middleware/logger.js'
import db from '../config/database.js';
import Estudiante from '../models/estudiante.model.js';


export async function getAll() {
    return await Estudiante.findAll();
}

export async function getById(id) {
    return await getOne(id);
}

export async function create(params) {
    if (await Estudiante.findOne({ where: { id: params.id } })) {
        throw 'Estudiante :"' + params.id + '" is already registered';
    }
    const estudiante = new Estudiante(params);
    await estudiante.save();
    return estudiante;
}

export async function update(id, params) {
    const estudiante_old = await getOne(id);
    estudiante_old.name = params.name;
    estudiante_old.surname = params.surname;
    estudiante_old.sex = params.sex;
    estudiante_old.birthdate = params.birthdate;
    estudiante_old.phone = params.phone;
    estudiante_old.email = params.email;
    estudiante_old.license = params.license;
    await estudiante_old.save();
    return estudiante_old;
}

export async function eliminate(id) {
    const estudiante = await Estudiante.destroy({
        where: {
            id
        }
    });
    if (!estudiante) throw 'Estudiante not found';
    return estudiante;
}

async function getOne(id) {
    const estudiante = await Estudiante.findByPk(id);
    if (!estudiante) throw 'Estudiante not found';
    return estudiante;
}

export default { getAll, getById, create, update, eliminate };