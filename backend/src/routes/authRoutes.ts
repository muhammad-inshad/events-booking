import { Router } from 'express';
import { authContainer } from '../di/auth.di';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, refreshTokenSchema } from '../dto/auth.schema';

const router = Router();

const { authController } = authContainer();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

export { router as authRoutes };
