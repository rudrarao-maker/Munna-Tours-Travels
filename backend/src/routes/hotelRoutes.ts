import { Router } from 'express';
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, authorize('admin', 'manager'), createHotel);
router.put('/:id', protect, authorize('admin', 'manager'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

export default router;
