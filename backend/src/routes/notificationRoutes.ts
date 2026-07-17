import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, sendNotification, broadcastNotification, deleteNotification } from '../controllers/notificationController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.post('/send', protect, authorize('admin', 'manager'), sendNotification);
router.post('/broadcast', protect, authorize('admin'), broadcastNotification);
router.delete('/:id', protect, deleteNotification);

export default router;
