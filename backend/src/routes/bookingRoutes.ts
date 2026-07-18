import express from 'express';
import { getBookings, getBookingById, createBooking, updateBookingStatus, downloadTicket, cancelBooking } from '../controllers/bookingController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../schemas/bookingSchema';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'manager'), getBookings)
  .post(protect, validate(createBookingSchema), createBooking);

router.get('/:id/ticket', protect, downloadTicket);
router.put('/:id/cancel', protect, cancelBooking);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, authorize('admin', 'manager'), updateBookingStatus);

export default router;
