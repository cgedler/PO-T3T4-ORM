
import { Router } from 'express';

import auth from './auth.routes.js';
import user from './user.routes.js';
import seccion from './seccion.routes.js';
import estudiante from './estudiante.routes.js';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/seccion', seccion);
router.use('/estudiante', estudiante);

export default router;