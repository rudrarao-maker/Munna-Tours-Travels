import express from 'express';
import { toggleWishlist, getMyWishlist } from '../controllers/wishlistController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/toggle', protect, toggleWishlist);
router.get('/', protect, getMyWishlist);

export default router;
