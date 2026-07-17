import express from 'express';
import { getBookings, getBookingById, createBooking, updateBookingStatus, downloadTicket, cancelBooking } from '../controllers/bookingController';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../schemas/bookingSchema';

const router = express.Router();

router.route('/')
  .get(getBookings)
  .post(validate(createBookingSchema), createBooking);

router.get('/:id/ticket', downloadTicket);
router.put('/:id/cancel', cancelBooking);

router.route('/:id')
  .get(getBookingById)
  .put(updateBookingStatus);

export default router;
