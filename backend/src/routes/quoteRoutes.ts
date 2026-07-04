import express from 'express';
import { createQuoteRequest, getQuoteRequests, updateQuoteStatus } from '../controllers/quoteController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', createQuoteRequest);
router.get('/', protect, getQuoteRequests);
router.put('/:id', protect, updateQuoteStatus);

export default router;
