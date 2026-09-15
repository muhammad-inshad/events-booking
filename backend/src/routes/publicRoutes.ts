import { Router } from 'express';
import { getPublicServices, getPublicServiceById, getServiceCategories } from '../controllers/publicController';

const router = Router();

router.get('/services/categories', getServiceCategories);
router.get('/services', getPublicServices);
router.get('/services/:id', getPublicServiceById);

export { router as publicRoutes };
