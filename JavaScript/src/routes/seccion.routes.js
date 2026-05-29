import jwtoken from '../services/jwt.service.js';
import { Router } from 'express';
const router = Router();

import { get, getById, insert, update, eliminate } from '../controllers/seccion.controller.js';

router.get('/', jwtoken.ensureToken, get);
router.get('/:id', jwtoken.ensureToken, getById);
router.post('/', jwtoken.ensureToken, insert);
router.put('/:id', jwtoken.ensureToken, update);
router.delete('/:id', jwtoken.ensureToken, eliminate);

export default router;