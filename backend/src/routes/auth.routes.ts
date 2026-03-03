// routes/auth.routes.ts

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

export default router;
