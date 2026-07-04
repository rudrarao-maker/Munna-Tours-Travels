import express from 'express';
import { getBookings, getBookingById, createBooking, updateBookingStatus } from '../controllers/bookingController';

const router = express.Router();

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBookingById)
  .put(updateBookingStatus);

export default router;
