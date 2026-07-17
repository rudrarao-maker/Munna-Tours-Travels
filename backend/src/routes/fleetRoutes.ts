import { Router } from 'express';
import { getFleetOverview, getFleetLogs, addFleetLog, getFleetAnalytics, assignDriver, updateVehicleStatus } from '../controllers/fleetController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, authorize('admin', 'manager'), getFleetOverview);
router.get('/analytics', protect, authorize('admin', 'manager'), getFleetAnalytics);
router.get('/:vehicleId/logs', protect, authorize('admin', 'manager'), getFleetLogs);
router.post('/logs', protect, authorize('admin', 'manager'), addFleetLog);
router.put('/:vehicleId/assign', protect, authorize('admin', 'manager'), assignDriver);
router.put('/:vehicleId/status', protect, authorize('admin', 'manager'), updateVehicleStatus);

export default router;
