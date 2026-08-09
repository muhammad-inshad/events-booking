import { Router } from 'express';
import { getPublicServices, getPublicServiceById } from '../controllers/publicController';

const router = Router();

router.get('/services', getPublicServices);
router.get('/services/:id', getPublicServiceById);

export { router as publicRoutes };
