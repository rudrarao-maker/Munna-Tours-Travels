import { Router } from 'express';
import { generateTripPlan, chatWithAI, optimizeRoute, getSavedTripPlans, getChatHistory, getAIRecommendations } from '../controllers/aiController';
import { protect, authorize, optionalAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/trip-plan', optionalAuth, generateTripPlan);
router.post('/chat', optionalAuth, chatWithAI);
router.post('/optimize-route', protect, authorize('admin', 'manager'), optimizeRoute);
router.get('/trip-plans', protect, getSavedTripPlans);
router.get('/recommendations', protect, getAIRecommendations);
router.get('/chat/:sessionId', getChatHistory);

export default router;
