import logger from '../middleware/logger.js'
import db from '../config/database.js';
import Seccion from '../models/seccion.model.js';


export async function getAll() {
    return await Seccion.findAll();
}

export async function getById(id) {
    return await getOne(id);
}

export async function create(params) {
    if (await Seccion.findOne({ where: { id: params.id } })) {
        throw 'Seccion :"' + params.id + '" is already registered';
    }
    const seccion = new Seccion(params);
    await seccion.save();
    return seccion;
}

export async function update(id, params) {
    const seccion_old = await getOne(id);
    seccion_old.description = params.description;
    seccion_old.journey = params.journey;
    seccion_old.quarter = params.quarter;
    await seccion_old.save();
    return seccion_old;
}

export async function eliminate(id) {
    const seccion = await Seccion.destroy({
        where: {
            id
        }
    });
    if (!seccion) throw 'Seccion not found';
    return seccion;
}

async function getOne(id) {
    const seccion = await Seccion.findByPk(id);
    if (!seccion) throw 'Seccion not found';
    return seccion;
}

export default { getAll, getById, create, update, eliminate };