import { Router } from 'express';
import { authContainer } from '../di/auth.di';

const router = Router();

const { authController } = authContainer();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);

export { router as authRoutes };
