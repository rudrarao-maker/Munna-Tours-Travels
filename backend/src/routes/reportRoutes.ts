import { Router } from 'express';
import { getReport, getSummary } from '../controllers/reportController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/summary', protect, authorize('admin', 'manager'), getSummary);
router.get('/:type', protect, authorize('admin', 'manager'), getReport);

export default router;
