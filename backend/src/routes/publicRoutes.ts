import { Router } from 'express';
import { publicContainer } from '../di/public.di';

const router = Router();
const { publicController } = publicContainer();

router.get('/services/categories', publicController.getServiceCategories);
router.get('/services', publicController.getPublicServices);
router.get('/services/:id', publicController.getPublicServiceById);

export { router as publicRoutes };
