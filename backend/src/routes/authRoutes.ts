import { Router } from 'express';
import { authContainer } from '../di/auth.di';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, refreshTokenSchema } from '../dto/auth.schema';

const router = Router();

const { authController } = authContainer();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

export { router as authRoutes };
