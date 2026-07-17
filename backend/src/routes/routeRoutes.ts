import express from 'express';
import { getRoutes, getRouteById, createRoute, deleteRoute, seedRoutes, updateRoute, getDynamicPrice } from '../controllers/routeController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getRoutes);
router.post('/seed', protect, seedRoutes);
router.get('/:id', getRouteById);
router.get('/:id/dynamic-price', getDynamicPrice);
router.post('/', protect, createRoute);
router.put('/:id', protect, updateRoute);
router.delete('/:id', protect, deleteRoute);

export default router;
