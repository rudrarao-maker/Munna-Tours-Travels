import { Router } from 'express';
import { submitFeedback, getAllFeedback, respondToFeedback, getSentimentAnalytics } from '../controllers/feedbackController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protect, submitFeedback);
router.get('/', protect, authorize('admin', 'manager'), getAllFeedback);
router.get('/analytics', protect, authorize('admin', 'manager'), getSentimentAnalytics);
router.put('/:id/respond', protect, authorize('admin', 'manager'), respondToFeedback);

export default router;
