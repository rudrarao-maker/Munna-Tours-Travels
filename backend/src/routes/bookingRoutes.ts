import express from 'express';
import { getBookings, getBookingById, createBooking, updateBookingStatus, downloadTicket, cancelBooking, getBookedSeats } from '../controllers/bookingController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../schemas/bookingSchema';

const router = express.Router();

// New route must be before /:id to avoid collision
router.get('/seats', getBookedSeats);

router.route('/')
  .get(protect, authorize('admin', 'manager'), getBookings)
  .post(protect, validate(createBookingSchema), createBooking);

router.get('/:id/ticket', protect, downloadTicket);
router.put('/:id/cancel', protect, cancelBooking);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, authorize('admin', 'manager'), updateBookingStatus);

export default router;
