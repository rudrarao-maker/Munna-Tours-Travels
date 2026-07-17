import { Router } from 'express';
import { updateDriverLocation, getDriverLocation, getFleetLocations, getLocationHistory, toggleDriverStatus } from '../controllers/trackingController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/location', protect, updateDriverLocation);
router.get('/driver/:driverId', getDriverLocation);
router.get('/fleet', protect, authorize('admin', 'manager'), getFleetLocations);
router.get('/history/:driverId', protect, authorize('admin', 'manager'), getLocationHistory);
router.put('/status', protect, toggleDriverStatus);

export default router;
