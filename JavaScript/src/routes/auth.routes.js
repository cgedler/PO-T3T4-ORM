import { Router } from 'express';
const router = Router();

import { login } from '../controllers/login.controller.js';

router.post('/login', login);

export default router;