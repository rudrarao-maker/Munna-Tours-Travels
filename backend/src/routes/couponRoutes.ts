import express from 'express';
import { validateCoupon, applyCoupon, getCoupons, createCoupon, deleteCoupon } from '../controllers/couponController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);
router.post('/apply', applyCoupon);

// Admin routes
router.get('/', protect, authorize('admin'), getCoupons);
router.post('/', protect, authorize('admin'), createCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;
